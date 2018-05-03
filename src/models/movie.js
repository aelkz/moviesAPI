var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const urlValidator = (v, cb) => {
    setTimeout(function() {
        var regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
        var msg = v + ' is not a valid URL';
        // First argument is a boolean, whether validator succeeded
        // 2nd argument is an optional error message override
        cb(regex.test(v), msg);
    }, 5);
};

// http://mongoosejs.com/docs/2.7.x/docs/validation.html
// http://mongoosejs.com/docs/validation.html
// https://www.regextester.com/93652
// https://github.com/dstroot/skeleton/blob/master/models/User.js (example)
var schema = new mongoose.Schema({
    title: { type: String, unique: true, required: [true, "can't be blank"], index: true },
    parentalGuidance: { type: String, uppercase: true, required: [true, "can't be blank"] },
    description: { type: String, required: [true, "can't be blank"] },
    genreList: [{ type: String, required: [true, "can't be blank"] }],
    runtime: { type: String, required: [true, "can't be blank"] },
    imdb: {
        type: String,
        validate: {
            isAsync: true,
            validator: urlValidator,
            // Default error message, overridden by 2nd argument to `cb()` above
            message: 'not a valid URL'
        },
        required: [true, "cant't be blank"]
    },
    rating: { type: Number, min: 0, max: 10 },
    metascoreRating: { type: Number, min: 0, max: 100 },
    directorsList: [{
        name: { type: String, default: '', required: [true, "can't be blank"] },
        imdb: {
            type: String,
            validate: {
                isAsync: true,
                validator: urlValidator,
                // Default error message, overridden by 2nd argument to `cb()` above
                message: 'not a valid URL'
            },
            required: [true, "cant't be blank"]
        }
    }],
    castList: [{
        name: { type: String, default: '', required: [true, "can't be blank"] },
        imdb: {
            type: String,
            validate: {
                isAsync: true,
                validator: urlValidator,
                // Default error message, overridden by 2nd argument to `cb()` above
                message: 'not a valid URL'
            },
            required: [true, "cant't be blank"]
        }
    }],
    storyLine: String,
    aspectRatio: String,
    releaseDate: Date,
    country: String,
    language: String
}, {timestamps: true});

// old
// castList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cast' }]
// directorsList: [{ type: String }]

schema.plugin(uniqueValidator, {message: 'is already registered.'});

export default mongoose.models.movie || mongoose.model('movie', schema);