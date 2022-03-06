const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const socketioConfig = require('./Config/socketio.config')
// const morgan = require('morgan');
// const cors = require("cors");
// const body_parser = require("body-parser");
// const mongoose = require("mongoose");

//create server
const app = express()
const server = http.createServer(app)
const io = socketio(server, {
  cors: {
    origin: '*',
  },
})
socketioConfig(io)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  next()
})

//listen on port number
server.listen(process.env.PORT || 8080, () => {
  console.log('I am live and listening...')
  // console.log(process.env.NODE_MODE);
})

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>')
})

//todo middlewares
