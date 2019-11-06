// const express = 'express';
// ? s3 then test on postman
const express = require('express');

const server = express();

// ? s4
const userRouter = require('./users/userRouter.js')

// ? s5
server.use(express.json())

// ? s9
server.use('/users', userRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {

};

module.exports = server;
