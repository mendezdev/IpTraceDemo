const mongoose = require('mongoose');

const countryMetricSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,    
    isoCode: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    distance: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('CountryMetric', countryMetricSchema);