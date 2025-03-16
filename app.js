require('express-async-errors')
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')

const url = config.MONGODB_URI
const port = config.PORT

mongoose.set('strictQuery', false)
console.log("Connnecting to ", url)

mongoose.connect(url)
    .then(() => {
        console.log("Connected successfully")
    })
    .catch(() => console.log("Cannot connect to mongodb"))

app.use(cors())
app.use(express.json())

if (process.env.NODE_ENV == 'test') {
    const testRouter = require('./controllers/testing')
    console.log(process.env.NODE_ENV)
    app.use("/api/testing", testRouter)
}

app.use("/api/blogs", blogsRouter)
app.use("/api/users", userRouter)
app.use("/api/login", loginRouter)

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app