var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
// var m2s = require('mongoose-to-swagger');

// see: https://github.com/simonguest/swagger-mongoose
// see: https://github.com/giddyinc/mongoose-to-swagger

const urlValidator = (v, cb) => {
    setTimeout(function() {
        var regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
        var msg = v + ' is not a valid URL';
        // First argument is a boolean, whether validator succeeded
        // 2nd argument is an optional error message override
        cb(regex.test(v), msg);
    }, 5);
};

const urlValidatorWrapper = {
    type: String,
    validate: {
        isAsync: true,
        validator: urlValidator,
        // Default error message, overridden by 2nd argument to `cb()` above
        message: 'not a valid URL'
    },
    required: [true, "cant't be blank"]
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
    runtime: { type: String, required: [true, "can't be blank"], maxlength: 3 },
    imdb: urlValidatorWrapper,
    rating: { type: Number, min: 0, max: 10 },
    metascoreRating: { type: Number, min: 0, max: 100 },
    directorsList: [{
        name: { type: String, default: '', required: [true, "can't be blank"] },
        imdb: urlValidatorWrapper
    }],
    castList: [{
        name: { type: String, default: '', required: [true, "can't be blank"] },
        role: { type: String, default: '', required: [true, "can't be blank"] },
        imdb: urlValidatorWrapper
    }],
    storyLine: String,
    aspectRatio: String,
    releaseDate: Date,
    country: String,
    language: String
}, {timestamps: true});

schema.plugin(uniqueValidator, {message: 'is already registered.'});

// const swaggerSchema = m2s(mongoose.model('movie', schema));
// console.log(swaggerSchema);

export default mongoose.models.movies || mongoose.model('movies', schema);