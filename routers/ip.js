const router = require('express').Router();

const redisClient = require('../services/redis-service');
const ipService = require('../services/ip-service');
const countryService = require('../services/country-service');
const utils = require('../utils/utils');
const countryMetricDb = require('../db/country-metric');

router.get('/:ipValue', async (req, res) => {
    const { ipValue } = req.params; // --> get the ip value to search
    const message = `The ip to trace is: ${ipValue}`; // --> the template message    

    if (!utils.isValidIp(ipValue)) {
        return res.status(400).json({
            message: 'The IP format is not valid. Check it and try again.'
        }); 
    }
    // get the ip information
    let ipInformation = null;
    try {
        ipInformation = await ipService.getIpInformation(ipValue);
    } catch (error) {
        // if the call fails then we respond with a 500 status code
        // this can be improved but for this example we keep simple
        return res.status(500).json({
            message: 'There was a problem trying to get the ip information. Verify the IP and try again please.'
        });
    }

    // instead of do all the logic, this check if the result for this iso code alreay exists and return it
    const existingResponse = await redisClient.getAsync(
        ipInformation.data.countryCode3
    );

    if (existingResponse) {
        const timezones = await redisClient.getAsync(`${ipInformation.data.countryCode3}_timezones`);
        const parsedData = JSON.parse(existingResponse);
        const updatedData = await utils.updateResponse(parsedData, JSON.parse(timezones));
        
        return res.status(200).json({
            message,
            isFromCache: true,
            data: updatedData
        });
    };
    
    // get the country information with the iso code    
    let countryInformation = null;
    try {
        countryInformation = await countryService.getCountryInformationByCode(
            ipInformation.data.countryCode3
        );
    } catch (error) {
        // if the call fails then we respond with a 500 status code
        // this can be improved but for this example we keep simple
        return res.status(500).json({
            message: 'There was a problem trying to get the country information. Please try in another moment.'
        });
    }

    // save the timezones in redis to update for the next request with the
    // the isoCode
    await redisClient.setAsync(
        `${ipInformation.data.countryCode3}_timezones`,
        JSON.stringify(countryInformation.data.timezones));

    // we call the formatter to create the response for the frontend
    const response = await utils.toIpTraceResponse(countryInformation.data);

    try {
        // save data for metrics and only if this not fails then the response is saved in redis
        // because if fails we wan't to this process until the metric is save with success
        await countryMetricDb.create({
            isoCode: response.isoCode,
            name: response.countryName,
            distance: response.distance
        });

        // set the response in cache for the next ip from the same iso country code
        await redisClient.setAsync(
            ipInformation.data.countryCode3,JSON.stringify(response));
    } catch (error) {
        // for this version, we don't to anything if metrics or redis fails
        // may be log the error
    }    

    // return response for the frontend
    return res.status(200).json({
        message,
        isFromCached: false,
        data: response
    })
})

module.exports = router;