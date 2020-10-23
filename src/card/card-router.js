//this will be the file that contains all of the information we need about the routes to our cards
const express = require('express')
//we will be using uuid so don't forget to install that with npm
const { v4: uuid } = require('uuid')
//import the logger
const logger = require('../logger')
//import the store
const { cards, lists } = require('../store')

const cardRouter = express.Router()
const bodyParser = express.json() //the express.json() middleware must be applied to parse the JSON data in the body of the request

cardRouter
    .route('/card')
    .get((req, res) => {
        res.json(cards);
    })
    //here we will implement a POST endpoint for card
    .post(bodyParser, (req, res) => {
        //first we will create a destructuring variable to get the data from the body
        //in this case the data is title and content
        const { title, content } = req.body;

        //validate that both title and content exist
        if (!title) {
            logger.error(`Title is required`);
            return res
                .status(400)
                .send('Invalid data');
        }
        if (!content) {
            logger.error(`Content is required`);
            return res
                .status(400)
                .send('Invalid data');
        }

        //if they do exist then we generate an ID and push a card object into the array
        const id = uuid();

        const card = {
            id,
            title,
            content
        };

        cards.push(card);

        //finally we will log the card creation and send a response including a location header.
        logger.info(`Card with id ${id} created`);

        res
            .status(201)
            .location(`http://localhost:8000/card/${id}`)
            .json(card);
    })

cardRouter
    .route('/card/:id') //we want to be able to get a single card by id which we do below
    .get((req, res) => {
        const { id } = req.params; //a destructured id object set to the value of the request parameters
        const card = cards.find(c => c.id == id); //setting a singular card variable to be the value of using the .find method on the cards array
        //where c represents a single card parameter passed through an arrow function that will set c id to the exact value of the id constant above.

        //we want to make sure we find a card if it is requested so here we will log an error then return a message to the client if one is not found.
        if (!card) {
            logger.error(`Card with id ${id} not found.`);
            return res
                .status(404)
                .send('Card Not Found');
        }
        //respond to the client with the card information, in json format, if a matching card is found
        res.json(card);
    })
    /*
    here we will create our DELETE endpoint.
    we will follow a similar pattern to the endpoints above but with a key difference in mind
    there is a relationship between cards and lists where a card can be in multiple lists and therefore,
    when a card is deleted we must ensure that the id is removed from all of the lists in which it is contained
    */
    .delete((req, res) => {
        const { id } = req.params;

        const cardIndex = cards.findIndex(c => c.id == id);

        if (cardIndex === -1) {
            logger.error(`Card with id ${id} not found.`);
            return res
                .status(404)
                .send('Not found');
        }

        //remove card from lists
        //assume cardIds are not duplicated in the cardIds array
        lists.forEach(list => {
            const cardIds = list.cardIds.filter(cid => cid !== id);
            list.cardIds = cardIds;
        });

        cards.splice(cardIndex, 1);

        logger.info(`Card with id ${id} deleted.`);

        res
            .status(204)
            .end();
    })

//DON'T FORGET TO EXPORT THE CARD ROUTER!!!
module.exports = cardRouter