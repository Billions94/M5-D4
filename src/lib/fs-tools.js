import fs from 'fs-extra'
import { fileURLToPath } from "url";
import { dirname, join } from 'path'

const { readJSON, writeJSON, writeFile} = fs 

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), '../datas')
const publicFolderPath = join(process.cwd(), './public/img/post')

const blogsJSONPath = join(dataFolderPath, 'post.json')
console.log(blogsJSONPath)

export const getBlogs = () => readJSON(blogsJSONPath)
export const writeBlogs = content => writeJSON(blogsJSONPath, content)

export const savePostImg = (fileName, contentAsBuffer) => writeFile(join(publicFolderPath, fileName), contentAsBuffer)


// export const uploadFile = async(req, res, next) => {
//     try {
//       const { originalname } = req.file;
//       const extension = extname(originalname);
//       const fileName = `${req.params.id}${extension}`;
//       await savePostImg()
//       const link = `http://localhost:3001/${fileName}`;
//       req.file = link;
//       next();
//     } catch (error) {
//       next(error);
//     }
//   };