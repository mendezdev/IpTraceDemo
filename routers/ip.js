const router = require('express').Router();
const geolib = require('geolib');

const ipService = require('../services/ip-service');
const utils = require('../utils/utils');

const buenosAiresLatLng = {
    latitude: -34.603722, longitude: -58.381592
};

router.get('/:ipValue', async (req, res) => {
    const { ipValue } = req.params;

    const ipInformation = await ipService.getIpInformation(ipValue);
    console.log('ipInformation: ', ipInformation.data);
    const distance = geolib.getDistance(
        buenosAiresLatLng,
        {
            latitude: ipInformation.data.latlng[0],
            longitude: ipInformation.data.latlng[1]
        }
    );

    const payload = {
        isoCode: ipInformation.data.alpha3Code,
        languages: ipInformation.data.languages.map(m => m.name),
        timezones: ipInformation.data.timezones,
        distance,
        currency: ipInformation.data.currencies[0].code
    };

    const response = await utils.toIpTraceResponse(payload);

    res.status(200).json({
        message: 'The ip to trace is: ' + ipValue,
        data: response
    })
})

module.exports = router;