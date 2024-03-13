const express = require('express');
const bodyParser = require('body-parser');
const pullRequestRoutes = require('./router/pullRequestRoutes');

const app = express();
const port = 3000;

// Parse JSON payloads
app.use(bodyParser.json());

// Handle GitHub webhook events
app.use('/webhook', pullRequestRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
