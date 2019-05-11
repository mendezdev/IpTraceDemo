const router = require('express').Router();

const ipService = require('../services/ip-service');

router.get('/:ipValue', async (req, res) => {
    const { ipValue } = req.params;

    const ipInformation = await ipService.getIpInformation(ipValue);
    console.log('ipInformation: ', ipInformation.data);
    res.status(200).json({
        message: 'The ip to trace is: ' + ipValue,
        payload: ipInformation.data
    })
})

module.exports = router;