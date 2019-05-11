const axios = require('axios');
const apiKey = require('../secrets/constants').currencyLayerApiKey;

const getExchangeByCurrencyCode = (date, source, currency) => {
    return axios.get(`http://apilayer.net/api/historical?access_key=${apiKey}&date=${date}&source=${source}&currencies=${currency}`);
}

module.exports = {
    getExchangeByCurrencyCode
}