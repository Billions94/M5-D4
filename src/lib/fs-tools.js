import fs from 'fs-extra'
import { fileURLToPath } from "url";
import { dirname, join } from 'path'

const { readJSON, writeJSON, writeFile} = fs 

const dataPathFolder = join(dirname(fileURLToPath(import.meta.url)), '../datas')

const blogsJSONPath = join(dataPathFolder, 'post.json')
console.log(blogsJSONPath)

export const getBlogs = () => readJSON(blogsJSONPath)
export const writeBlogs = content => writeJSON(blogsJSONPath, content)