import model from '../models/movie.model';


const getById = async(id) => {
    const res = await movie.findById(id);
    return res;
};

const get = async() => {
    const res = await movie.find({
        active: true
    });
    return res;
};

const create = async(body) => {
    var movie = new model(body);
    const res = await movie.save(movie);
    return res;
};

const update = async(id, body) => {
    await Product
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

const remove = async(id) => {
    await model.findOneAndRemove(id);
};

export default { create, remove };