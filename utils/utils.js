const moment = require('moment');

const exchangeService = require('../services/exchange-service');

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

const toIpTraceResponse = async ipInformation => {
    const dollar = 'USD';
    const timezones = buildTime(ipInformation.timezones);
    const dateFormatted = timezones[0].newFormatted;
    const exchange = await exchangeService.getExchangeByCurrencyCode(
        dateFormatted, 'USD', ipInformation.currency
    );

    const information = {
        isoCode: ipInformation.isoCode,
        languages: ipInformation.languages.join(', '),
        times: timezones.map(t => t.timeFormatted).join(' | '),
        distance: convertMetersToKilometers(ipInformation.distance),
        currency: ipInformation.currency,
        exchange: round(exchange.data.quotes[dollar + ipInformation.currency], 2)
    }

    return information;
}

module.exports = {
    convertMetersToKilometers,
    round,
    buildTime,
    toIpTraceResponse
}