import express from 'express'
import listEndpoints from 'express-list-endpoints'
import blogPostRouter from '../src/apis/blogPost/index.js'
import { badRequest, unAuthorized, notFound, genericError } from './errorHandler.js'
import cors from 'cors'
import { join } from 'path'

const server = express()
const port = 3001

const publicFolderPath = join(process.cwd(),"./public")

server.use(cors())
server.use(express.json())

server.use(express.static(publicFolderPath))
server.use('/post', blogPostRouter)
console.table(listEndpoints(server))

server.use(badRequest)
server.use(unAuthorized)
server.use(notFound)
server.use(genericError)



server.listen(port, ()=> {
    console.log('listening on port', port)
}) 