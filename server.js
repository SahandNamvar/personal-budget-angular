// NodeJS

const express = require('express'); //request express
const app = express(); // initiate an express app
const port = 3000; // define port

// define the route to the static content located inside public folder
app.use('/', express.static('public'))

const budget = {myBudget: [
    {title: 'Eat out', budget: 90},
    {title: 'Rent', budget: 2800},
    {title: 'Groceries', budget: 450},
]};

// define a route to /hello --> send html
app.get('/hello', (req, res) => {
    res.send('Hello World from Node JS')
});

// define a new route to /budget --> send json object (budget)
app.get('/budget', (req, res) => {
    res.json(budget);
});


// serve the route
app.listen(port, () => {
    console.log('Example app listening at http://localhost:', port)
});