const moment = require('moment');
const geolib = require('geolib');

const exchangeService = require('../services/exchange-service');
const constants = require('./constants');

const convertMetersToKilometers = distance => {
    var result = distance / 1000;

    return round(result, 2);
}

const round = (value, decimals) => {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

const buildTime = (timezones) => {
    // iterate for all the timezones that the country has and
    // then separate the symbol and the number UTC to pass to the utcDate method 
    const timeZonesFormatted = timezones.map(time => {
        const symb = time.indexOf('+') !== -1 ? '+' : '-';
        const hourTime = time.substring(time.indexOf(symb) + 1, time.indexOf(symb) + 3);
        const dateInformation = utcDate(symb, hourTime);

        return {
            timeFormatted: `${dateInformation.date} ${dateInformation.time} (${time})`,
            date: dateInformation.date,
            dateFormattedByDash: dateInformation.dateFormattedByDash
        };
    });

    return timeZonesFormatted;
}

const utcDate = (symb, hour) => {
    // depending of the symbol we add or substract
    let time = symb == '+' ? moment.utc().add(hour, 'hour') : moment.utc().subtract(hour, 'hour');

    // we struct the response to get date, time and formatted by dash for the exchange service call
    return {
        date: `${time.locale('es').format('L')}`,
        time: `${time.locale('es').format('LTS')}`,
        dateFormattedByDash: `${time.format('YYYY-MM-DD')}`
    };
}

const getExhange = async (date, from, to) => {
    // we call the exchange service, if success then we return the value with 2 decimals
    // if fails, we return '--'
    // this could be handled in a better way but for this beta version is fine
    try {
        const exchange = await exchangeService.getExchangeByCurrencyCode(
            date, from, to
        );

        const result = round(exchange.data.quotes[from + to], 2);
        return result.toString();
    } catch (err) {
        return '--';
    }
}

const updateResponse = async (response, timezones) => {
    const updatedTimes = buildTime(timezones);
    const updatedExchange = await getExhange(
        updatedTimes[0].dateFormattedByDash, 'USD', response.currency);

    return {
        ...response,
        times: updatedTimes.map(t => t.timeFormatted).join(' | '),
        exchange: updatedExchange
    }
}

const toIpTraceResponse = async countryInformation => {
    // for this version, the central currency is 'USD'
    const dollar = 'USD';
    // building the timezones for the response
    const timezones = buildTime(countryInformation.timezones);
    // get the exchange for the response sending the date separated by dashes, the 'from' currency and the 'to' currency
    const exchangePromise = getExhange(
        timezones[0].dateFormattedByDash, dollar, countryInformation.currencies[0].code);

    // using getlib the get the distance from the central lat and lng to the 
    // lat and lng country to ask
    const distance = geolib.getDistance(
        constants.buenosAiresLatLng,
        {
            latitude: countryInformation.latlng[0],
            longitude: countryInformation.latlng[1]
        }
    );

    const distanceInKm = convertMetersToKilometers(distance);
    // build the response
    return {
        countryName: countryInformation.name,
        isoCode: countryInformation.alpha3Code,
        languages: countryInformation.languages.map(m => m.name).join(', '),
        times: timezones.map(t => t.timeFormatted).join(' | '),
        distance: distanceInKm,
        distanceResponse: round(distanceInKm, 2).toString(),
        currency: countryInformation.currencies[0].code,
        exchange: (await exchangePromise)
    };
}

module.exports = {
    convertMetersToKilometers,
    round,
    buildTime,
    toIpTraceResponse,
    updateResponse
}