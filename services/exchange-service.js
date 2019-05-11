const axios = require('axios');

const getExchangeByCurrencyCode = (date, source, currency) => {
    return axios.get(`http://apilayer.net/api/historical?access_key=${process.env.CURRENCY_LAYER_APIKEY}&date=${date}&source=${source}&currencies=${currency}`);
}

module.exports = {
    getExchangeByCurrencyCode
}