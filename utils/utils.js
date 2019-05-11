const moment = require('moment');
const geolib = require('geolib');

const exchangeService = require('../services/exchange-service');

const buenosAiresLatLng = {
    latitude: -34.603722, longitude: -58.381592
};

const convertMetersToKilometers = distance => {
    var result = distance / 1000;

    return round(result, 2);
}
  
const round = (value, decimals) => {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

const buildTime = (timezones) => {
    const timeZonesFormatted = timezones.map(time => {
        const symb = time.indexOf('+') !== -1 ? '+' : '-';
        const hourTime = time.substring(time.indexOf(symb) + 1, time.indexOf(symb) + 3);
        const dateInformation = utcDate(symb, hourTime);

        return {
            timeFormatted: `${dateInformation.date} ${dateInformation.time} (${time})`,
            date: dateInformation.date,
            newFormatted: dateInformation.newFormatted
        };
    });

    return timeZonesFormatted;
}

const utcDate = (symb, hour) => {
    let time = symb == '+' ? moment.utc().add(hour, 'hour') : moment.utc().subtract(hour, 'hour');

    return {
        date: `${time.locale('es').format('L')}`,
        time: `${time.locale('es').format('LTS')}`,
        newFormatted: `${time.format('YYYY-MM-DD')}`
    };
}

const getExhange = async (date, from, to) => {
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

const toIpTraceResponse = async countryInformation => {
    const dollar = 'USD';
    const timezones = buildTime(countryInformation.timezones);
    const dateFormatted = timezones[0].newFormatted;
    const exchangePromise = getExhange(dateFormatted, dollar, countryInformation.currencies[0].code);

    const distance = geolib.getDistance(
        buenosAiresLatLng,
        {
            latitude: countryInformation.latlng[0],
            longitude: countryInformation.latlng[1]
        }
    );

    return {
        countryName: countryInformation.name,
        isoCode: countryInformation.alpha3Code,
        languages: countryInformation.languages.map(m => m.name).join(', '),
        times: timezones.map(t => t.timeFormatted).join(' | '),
        distance: convertMetersToKilometers(distance),
        currency: countryInformation.currencies[0].code,
        exchange: (await exchangePromise)
    };
}

module.exports = {
    convertMetersToKilometers,
    round,
    buildTime,
    toIpTraceResponse
}