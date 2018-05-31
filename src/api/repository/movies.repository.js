import model from '../models/movie.model';


const getById = async(id) => {
    const res = await model.findById(id);
    return res;
};

const get = async() => {
    //const res = await model.find({
    //    active: true
    //});
    const res = await model.find();
    return res;
};

const create = async(body) => {
    var movie = new model(body);
    const res = await movie.save(movie);
    return res;
};

// the entire document must be updated.
const update = async(id, body) => {
    await model
    .findByIdAndUpdate(id, {
        $set: {
            title: body.title,
            parentalGuidance: body.parentalGuidance,
            description: body.description,
            genreList: body.genreList,
            runtime: body.runtime,
            imdb: body.imdb,
            rating: body.rating,
            metascoreRating: body.metascoreRating,
            directorsList: body.directorsList,
            castList: body.castList,
            storyLine: body.storyLine,
            aspectRatio: body.aspectRatio,
            releaseDate: body.releaseDate,
            country: body.country,
            language: body.language
        }
    });
};

// only parts of the document should be updated.
const patch = async(id, body) => {
    await model.update({_id : id}, {$set: body});
};

const remove = async(id) => {
    await model.findOneAndRemove(id);
};

export default { get, getById, create, remove, update, patch };