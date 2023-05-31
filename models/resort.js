const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const ResortSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

ResortSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
    // console.log(doc);
});

const Resort = mongoose.model('Resort', ResortSchema);

module.exports = Resort;