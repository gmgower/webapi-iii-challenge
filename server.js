// const express = 'express';
// ? s3 then test on postman
const express = require('express');

const server = express();

// ? s4
const userRouter = require('./users/userRouter.js')
const postRouter = require('./posts/postRouter.js')

// ? s5
server.use(express.json())
server.use(logger);

// ? s9
server.use('/users', userRouter);
server.use('/posts', postRouter)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {
  console.log(`The Logger: [${new Date().toISOString()}] ${req.method} to ${req.url}`);
  next()
};

module.exports = server;
