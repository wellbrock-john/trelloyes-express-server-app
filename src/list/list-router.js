//this will be the file that contains all of the information we need about the routes to our list
const express = require('express')
//we will be using uuid so don't forget to install that with npm
const { v4: uuid } = require('uuid')
//import the logger
const logger = require('../logger')
//import the store
const { cards, lists } = require('../store')

const listRouter = express.Router()
const bodyParser = express.json() //the express.json() middleware must be applied to parse the JSON data in the body of the request

listRouter
    .route('/list')
    .get((req, res) => {
        res.json(lists)
    })
    .post(bodyParser, (req, res) => {
        const { header, cardIds = [] } = req.body;

        if (!header) {
            logger.error(`Header is required`);
            return res
                .status(400)
                .send('Invalid data');
        }

        // check card IDs
        if (cardIds.length > 0) {
            let valid = true;
            cardIds.forEach(cid => {
                const card = cards.find(c => c.id == cid);
                if (!card) {
                    logger.error(`Card with id ${cid} not found in cards array.`);
                    valid = false;
                }
            });

            if (!valid) {
                return res
                    .status(400)
                    .send('Invalid data');
            }
        }

        // get an id
        const id = uuid();

        const list = {
            id,
            header,
            cardIds
        };

        lists.push(list);

        logger.info(`List with id ${id} created`);

        res
            .status(201)
            .location(`http://localhost:8000/list/${id}`)
            .json({ id });
    })

listRouter
    .route('/list/:id') //we can create a nearly identical GET endpoint, for list, as the one for card
    .get((req, res) => {
        const { id } = req.params;
        const list = lists.find(li => li.id == id);

        if (!list) {
            logger.error(`List with id ${id} not found.`);
            return res
                .status(404)
                .send('List Not Found');
        }

        res.json(list);
    })
    .delete((req, res) => {
        //here we are destructuring the id from the params that the client will request from our server
        const { id } = req.params;


        //here we will create a variable that will attempt to contain the value of the the list's index within our server
        //we must validate the request
        const listIndex = lists.findIndex(li => li.id == id);

        //this is where we will validate that request and throw an error message if it does not pass
        if (listIndex === -1) {
            logger.error(`List with id ${id} not found.`);
            return res
                .status(404)
                .send('Not Found');
        }

        //down here we will splice the list if the client's request is valid
        //with this splice method, we are saying:
        //within lists, start the splice (aka start to remove items from the array), at listIndex and delete only that 1 item
        //note that if we put 2 where 1 is then it would delete the item in the array that comes after the item we intended to delete
        //this can scale for the length of the array in fact.
        lists.splice(listIndex, 1);

        logger.info(`List with id ${id} deleted`); //don't forget to log the delete!
        res
            .status(204)
            .end(); //we don't need to send a message back to the client so we can use .end() here
    })

module.exports = listRouter