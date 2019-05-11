const router = require('express').Router();

const countryMetricDb = require('../db/country-metric');

router.get('/', async (req, res) => {
    const metrics = await countryMetricDb.getAll();

    return res.status(200).json(metrics);
})

router.get('/ml/report', async (req, res) => {
    const metrics = await countryMetricDb.getMLReport();

    return res.status(200).json(metrics);
})

module.exports = router;