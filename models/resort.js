const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResortSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

const Resort = mongoose.model('Resort', ResortSchema);

module.exports = Resort;