/*The logger that we're using needs to be available for both the list and card routers
So we are placing the logger here in it's own file 
This is considered "layering" because we are making the logger available on a theoretical 
"layer above" the routers so that it can be required by both
We are vertically organizing in this case but, the horizontal organization of the router files is considered
"modularizing" DIFFERENT than "layering" but of the same ilk due to the fact that they have to do with organization */

//We will be using the logger Winston in this project

/*Winston has six levels of severity: silly, debug, verbose, info, warn and error. 
You can configure Winston to log at different levels for different environments. 
Here we are setting the level to info. This means that it will log everything with a severity of info and greater. 
It is also possible to format the log output in a number of ways or even choose where the logs will be stored. 
Here the logs will be stored in a file named info.log in JSON format. 
But in the development environment, it will also log to the console. 
We will add logging statements to the code below. */

const winston = require('winston')
const { NODE_ENV } = require('./config')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'info.log' })
  ]
})

if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

module.exports = logger