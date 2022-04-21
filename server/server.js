require('dotenv').config()
const fs = require('fs')
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const body_parser = require('body-parser')
const connectToDb = require('./Config/db')
const path = require('path')
const authRouter = require('./Routers/authRouter')
const socketio = require('socket.io')
const socketioConfig = require('./Config/socketio.config')
const passport = require('./Service/passport')
//router variables
// const workspaceRouter = require('./Routers/workSpaceRoute')

//create server
const app = express()
//https
const https = require('https')
const UserRouter = require('./Routers/userRouter')
//secure headers
app.use(helmet())

//passport
app.use(passport.init().initialize())
//use morgan
app.use(morgan(':method :url :status :http-version :response-time '))

// allow cross origin
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  next()
})

//image upload
app.use('/media', express.static(path.join(__dirname, 'Media')))

// body parser
app.use(body_parser.json())
app.use(body_parser.urlencoded({ extended: true }))

//listening to port 8000
const port = process.env.PORT || 8000
//create server with https
const server = https
  .createServer(
    {
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem'),
    },
    app,
  )
  .listen(port, async () => {
    try {
      await connectToDb()
      console.log(`server running on ${port}`)
    } catch (error) {
      console.log(error)
    }
  })

const io = socketio(server, {
  cors: {},
  origin: '*',
})
socketioConfig(io);

//put routes
app.use(authRouter)
app.use(UserRouter)

//Not found MW
app.use((req, res) => {
  res.status(404).json({ page: 'Not Found' })
})

//Error MW
app.use((error, req, res, next) => {
  try {
    let status = error.status || 500
    res.status(status).json({ Error: `${error}` })
  } catch (error) {
    next(error)
  }
})
