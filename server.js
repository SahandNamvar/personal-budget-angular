// NodeJS
const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');

// Function to read budget data from the JSON file
function readBudgetData() {
    try {
        const data = fs.readFileSync('budget_data.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading budget data:', error);
        return null;
    }
}

// Route to serve static content located inside the public folder
app.use('/', express.static('public'));

// Route to send HTML response for /hello
app.get('/hello', (req, res) => {
    res.send('Hello World from Node JS');
});

// Route to send JSON response (budget data) for /budget
app.get('/budget', (req, res) => {
    const budgetData = readBudgetData();

    if (budgetData) {
        res.json(budgetData);
    } else {
        // Send an error response if reading data fails
        res.status(500).send('Internal Server Error');
    }
});

// Serve the route
app.listen(port, () => {
    console.log('Example app listening at http://localhost:', port);
});
