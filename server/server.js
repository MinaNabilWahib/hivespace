//global variables
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const body_parser = require('body-parser')
const mongoose = require('mongoose')

//router variables
const workspaceRouter = require('./routers/workSpaceRoute')

//create server
const app = express()

//listen on port number
app.listen(process.env.PORT || 8080, () => {
  console.log('I am live and listening...')
})

//connect data base

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log('Data base connected')
    console.log(process.env.NODE_MODE)
  })
  .catch(err => {
    console.log('database failed')
  })

//Middle Wares
//first MW  method, url
app.use(morgan('tiny'))

//Second MW CORS
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*')
  response.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT,OPTIONS')
  response.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  next()
})

//body parser
app.use(body_parser.json())
app.use(body_parser.urlencoded({ extended: false }))

//routes
app.use(workspaceRouter)

//General middleware for not Found url pathes
app.use((req, res) => {
  res.status(404).json({ data: 'Not Found' })
})

//Error handling middleware that will catch all system Errors
app.use((err, req, res, nxt) => {
  let status = err.status || 500
  res.status(status).json({ Error: err + ' ' })
})
