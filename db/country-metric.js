const mongoose = require('mongoose');

const CountryMetric = require('../models/country-metric');
const utils = require('../utils/utils');

exports.create = data => {
    const metric = new CountryMetric({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });

    return metric.save();
}

exports.getAll = () => {
    return CountryMetric.find().exec();
}

exports.getMLReport = async () => {
    // get the metrics order by distance desc
    // so the first will be the further and the last one
    // will be the closest
    const metricsDesc = await CountryMetric
        .find()
        .sort({ distance: 'desc' })
        .exec();
    
    // define the default value
    const defaultValue = '--';
    const response = {
        further: defaultValue,
        closest: defaultValue,
        average: defaultValue
    };

    // if there is no metrics yet, then return the default
    if (metricsDesc.length < 0) return response;

    // by order, the first is the further
    const further = metricsDesc[0];
    let closest = null;

    const closestIndex = metricsDesc.length - 1;

    // logic to know if there is only one metric at the moment
    closest = (closestIndex < 0 || closestIndex === 0) ?
        closest = metricsDesc[0] :
        closest = metricsDesc[closestIndex];

    // logic to get the average
    const distanceSum = metricsDesc.reduce((prev, current) => {
        prev = prev + current.distance;

        return prev;
    }, 0);

    const average = utils.round(distanceSum / metricsDesc.length, 2);

    return {
        further: utils.round(further.distance, 2).toString(),
        closest: utils.round(closest.distance, 2).toString(),
        average: utils.round(average, 2).toString()
    }
}