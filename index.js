const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const uri = 'mongodb://mongo/DummyDbName';

mongoose.connect(uri, {
    useNewUrlParser: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const ipRouter = require('./routers/ip');
const countryMetricRouter = require('./routers/country-metric');

app.use('/api/ip', ipRouter);
app.use('/api/metrics', countryMetricRouter);
app.use('/', express.static(__dirname + '/public'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server listening on port: ' + port));