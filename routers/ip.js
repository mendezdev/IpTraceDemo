const router = require('express').Router();
const geolib = require('geolib');

const ipService = require('../services/ip-service');
const countryService = require('../services/country-service');
const utils = require('../utils/utils');

const buenosAiresLatLng = {
    latitude: -34.603722, longitude: -58.381592
};

router.get('/:ipValue', async (req, res) => {
    const { ipValue } = req.params;

    const ipInformation = await ipService.getIpInformation(ipValue);
    const countrInformation = await countryService.getCountryInformationByCode(
        ipInformation.data.countryCode3
    );

    console.log('ipInformation: ', ipInformation.data);
    console.log('countrInformation: ', countrInformation.data);

    const distance = geolib.getDistance(
        buenosAiresLatLng,
        {
            latitude: countrInformation.data.latlng[0],
            longitude: countrInformation.data.latlng[1]
        }
    );

    const payload = {
        isoCode: countrInformation.data.alpha3Code,
        languages: countrInformation.data.languages.map(m => m.name),
        timezones: countrInformation.data.timezones,
        distance,
        currency: countrInformation.data.currencies[0].code
    };

    const response = await utils.toIpTraceResponse(payload);

    res.status(200).json({
        message: 'The ip to trace is: ' + ipValue,
        data: response
    })
})

module.exports = router;