// Necessary Imports
const express = require('express');
const morgan = require('morgan')
const dotenv = require('dotenv')
const userRouter = require('./routers/userRouter')
const app = express();

// Configuring dotenv
dotenv.config({"path":"./config.env"})

// Allowing parsing of JSON in express application
app.use(express.json())

// Routes for users
app.use('/api/v1/users', userRouter)

// Use morgan if environment is development
if(process.env.ENV === "development"){
    app.use(morgan('dev'))
}



module.exports = app;