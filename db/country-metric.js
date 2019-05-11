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
    const metricsDesc = await CountryMetric
        .find()
        .sort({ distance: 'desc' })
        .exec();

    const further = metricsDesc[0];
    let closest = null;

    const closestIndex = metricsDesc.length - 1;

    closest = (closestIndex < 0 || closestIndex === 0) ?
        closest = metricsDesc[0] :
        closest = metricsDesc[closestIndex];

    const distanceSum = metricsDesc.reduce((prev, current) => {
        prev = prev + current.distance;

        return prev;
    }, 0);

    const average = utils.round(distanceSum / metricsDesc.length, 2);

    return {
        further,
        closest,
        average
    }
}