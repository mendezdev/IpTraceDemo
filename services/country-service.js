const axios = require('axios');

const getCountryInformationByCode = code => {
    return axios.get(`https://restcountries.eu/rest/v2/alpha/${code}`);
};

module.exports = {
    getCountryInformationByCode
}