const express = require('express');
require('./db/mongoose'); // Only call the mongoose to ensure that the app is connected in the database

const customerRouter = require('./routers/customer');

const app = express();
const port = process.env.PORT || 3000;

// Automatically parse incoming json to an object so we can access it in our request handlers
app.use(express.json());
app.use(customerRouter);

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});
