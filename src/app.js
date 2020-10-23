//much of this file is a part of a boilerplate I created
//anything that is not commented on is part of that boilerplate

require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')

const { NODE_ENV } = require('./config')
//import the cardRouter
const cardRouter = require('./card/card-router')
//import the listRouter
const listRouter = require('./list/list-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

//we're going to add authorization middleware here
app.use(function validateBearerToken(req, res, next) {
  //first we will setup two constant variables.
  //one will be for a valid API token and the other will represent the api token we will receive from the client.
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  //if there is not a variable 'authToken' or if the 'split' apart authToken variable, at index 1, is not equal to the apiToken,
  //then we want to log the error with some information that may be helpful to the client and respond to the client
  //after that we will return a response status of 401 in json format that tells the user, they have submitted an 'Unauthorized request'.
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  //move to next middleware
  next()
})
//implement the cardRouter and listRouter here
//NOTE!!! we 'use' these routers AFTER the validateBearerToken because we want the validation to take place before any routes get handled.
app.use(cardRouter)
app.use(listRouter)

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app