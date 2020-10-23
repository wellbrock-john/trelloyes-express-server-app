//this file is another example of implementing layering
//we will be able to allow both router files to utilize the arrays that we have

const cards = [{
    id: 1,
    title: 'Task One',
    content: 'This is card one'
  }]
  
  const lists = [{
    id: 1,
    header: 'List One',
    cardIds: [1]
  }]
  
  module.exports = { cards, lists }