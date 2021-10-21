// import express from 'express'
// import multer from 'multer'

// import {savePostImg} from '../../lib/fs-tools.js'

// const filesRouter = express.Router()

// filesRouter.post('/uploadSingle', multer().single('picture'), blogsValidation, async(req, res, next) => {
//   try {
    
//     await savePostImg(req.file.originalname, req.file.buffer)
//     res.send('ok')
//   } catch (error) {
//       next(error)
//   }
// })
// filesRouter.post('/uploadMultiple', multer().array('picture'), blogsValidation, async(req, res, next) => {
    
//     try {
      
//       const arrayOfPictures = req.files.map(file => savePostImg(req.file.originalname, req.file.buffer))
//       await Promise.all(arrayOfPictures)
//     } catch (error) {
//         next(error)
//     }
//   })



