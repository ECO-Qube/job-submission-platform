// from https://nodejs.org/en/docs/guides/nodejs-docker-webapp
'use strict';

const express = require('express');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(express.static('/server'));

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});