const axios = require('axios');

const getExchangeByCurrencyCode = (date, source, currency) => {
    return axios.get(`http://apilayer.net/api/historical?access_key=${constants.currencyLayerApiKey}&date=${date}&source=${source}&currencies=${currency}`);
}

module.exports = {
    getExchangeByCurrencyCode
}