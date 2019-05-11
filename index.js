const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const ipRouter = require('./routers/ip');

app.use('/api/ip', ipRouter);
app.use('/', express.static(__dirname + '/public'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server listening on port: ' + port));