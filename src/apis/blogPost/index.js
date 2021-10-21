import express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { blogsValidation } from "./validation.js";
import { validationResult } from "express-validator";
import { getBlogs, writeBlogs } from "../../lib/fs-tools.js";
import path from "path";
// import { uploadFile } from "../../lib/fs-tools.js";

import multer from "multer";

import { savePostImg } from "../../lib/fs-tools.js";

const blogPostRouter = express.Router();

// 1. Post, posting a new blog post
blogPostRouter.post("/", blogsValidation, async (req, res, next) => {
  try {
    const errorList = validationResult(req);

    if (!errorList.isEmpty()) {
      next(createHttpError(400, { errorList }));
    } else {
      const newPost = { ...req.body, createdAt: new Date(), id: uniqid() };
      const blogPost = await getBlogs();
      blogPost.push(newPost);

      await writeBlogs(blogPost);

      res.status(203).send({ id: newPost.id });
    }
  } catch (error) {
    next(error);
  }
});
// Post picture
blogPostRouter.post(
  "/:blogId/uploadSingle",
  multer().single("picture"),

  async (req, res, next) => {
    try {
      console.log(req.file);
      const errorList = validationResult(req);

      const posts = await getBlogs();

      const post = posts.find((p) => p.id === req.params.blogId);
      if (post && req.file) {
        const extention = path.extname(req.file.originalname);

        await savePostImg(req.params.blogId + extention, req.file.buffer);

        const coverUrl = `http://localhost:3001/img/post/${req.params.blogId}${extention}`;

        post.cover = coverUrl;
        const postsArray = posts.filter((p) => p.id !== req.params.blogId);

        postsArray.push(post);

        await writeBlogs(postsArray);

        res.status(200).send("post success ");
      } else {
        next(createHttpError(400, { errorList }));
      }
    } catch (error) {
      next(error);
    }
  }
);

// 2. Get, get all blog posts
blogPostRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await getBlogs();
    if (req.query && req.query.title) {
      const filteredBlogPost = blogs.filter(
        (blog) => blog.title === req.query.title
      );
      res.send(filteredBlogPost);
    } else {
      res.send(blogs);
    }
  } catch (error) {
    next(error);
  }
});

// Get, get a single blog post with their particular ID
blogPostRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blogs = await getBlogs();
    const blog = blogs.find((blog) => blog.id === req.params.blogId);

    if (blog) {
      res.send(blog);
    } else {
      next(
        createHttpError(404, `Blog with is ${req.params.blogId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

// 3. Delete, we are deleting single blog post with their particular ID
blogPostRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const blogs = await getBlogs();
    const blogsLeft = blogs.filter((blog) => blog.id !== req.params.blogId);
    await writeBlogs(blogsLeft);
    res.status(203).send();
  } catch (error) {
    next(error);
  }
});

// 4. Update, we are updating an already existing blog post
blogPostRouter.put("/:blogId", blogsValidation, async (req, res, next) => {
  try {
    const errorList = validationResult(req);

    if (!errorList.isEmpty()) {
      next(createHttpError(404, { errorList }));
    } else {
      const blogs = await getBlogs();
      const index = blogs.findIndex((blog) => blog.id === req.params.blogId);
      const editedPost = {
        ...blogs[index],
        ...req.body,
        updatedAt: new Date(),
        id: req.params.blogId,
      };
      blogs[index] = editedPost;

      await writeBlogs(blogs);
      res.send(editedPost);
    }
  } catch (error) {
    next(error);
  }
});

blogPostRouter.put(
  "/:blogId/comment",

  async (req, res, next) => {
    try {

      const { text, userName } = req.body;

      const comment = { id: uniqid(), text, userName, createdAt: new Date() };

      const blogs = await getBlogs();

      const index = blogs.findIndex((blog) => blog.id === req.params.blogId);

      blogs[index].comments = blogs[index].comments || [];
      const editedPost = {
        ...blogs[index],
        ...req.body,
        comments: [...blogs[index].comments, comment],
        // updatedAt: new Date(),
        id: req.params.blogId,
      };
      blogs[index] = editedPost;

  
      await writeBlogs(blogs);
      res.send(editedPost);

    } catch (error) {
      next(error);
    }
  }
);

export default blogPostRouter;
