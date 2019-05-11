const axios = require('axios');

const ip2countryUrl = 'https://api.ip2country.info/ip';

const getIpInformation = ip => {
    return axios.get(`${ip2countryUrl}?${ip}`);
}

module.exports = {
    getIpInformation
}