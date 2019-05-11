const router = require('express').Router();

const redisClient = require('../services/redis-service');
const ipService = require('../services/ip-service');
const countryService = require('../services/country-service');
const utils = require('../utils/utils');

router.get('/:ipValue', async (req, res) => {
    const { ipValue } = req.params;
    const message = `The ip to trace is: ${ipValue}`;
    const ipInformation = await ipService.getIpInformation(ipValue);
    const existingResponse = await redisClient.getAsync(
        ipInformation.data.countryCode3
    );

    if (existingResponse) {
        return res.status(200).json({
            message,
            isCached: true,
            data: JSON.parse(existingResponse)
        });
    };

    const countrInformation = await countryService.getCountryInformationByCode(
        ipInformation.data.countryCode3
    );

    const response = await utils.toIpTraceResponse(countrInformation.data);
    
    await redisClient.setAsync(
        ipInformation.data.countryCode3,JSON.stringify(response));
    
    return res.status(200).json({
        message,
        isCached: false,
        data: response
    })
})

module.exports = router;