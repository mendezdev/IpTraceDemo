const router = require('express').Router();

const redisClient = require('../services/redis-service');
const ipService = require('../services/ip-service');
const countryService = require('../services/country-service');
const utils = require('../utils/utils');

router.get('/:ipValue', async (req, res) => {
    const { ipValue } = req.params;
    const message = `The ip to trace is: ${ipValue}`;
    let ipInformation = null;

    try {
        ipInformation = await ipService.getIpInformation(ipValue);
    } catch (error) {
        return res.status(500).json({
            message: 'There was a problem trying to get the ip information. Verify the IP and try again please.'
        });
    }

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
    
    let countrInformation = null;

    try {
        countrInformation = await countryService.getCountryInformationByCode(
            ipInformation.data.countryCode3
        );
    } catch (error) {
        return res.status(500).json({
            message: 'There was a problem trying to get the country information. Please try in another moment.'
        });
    }

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