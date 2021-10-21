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