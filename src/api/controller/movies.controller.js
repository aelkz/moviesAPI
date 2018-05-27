import MovieModel from '../models/movie.model';

/**
 * Get movie
 * @returns {Movie}
 */
function load(req,res) {
    MovieModel.find(function(err,movies) {
        if(err) {
            res.status(500).send(err);
        }else {
            res.json(movies);
        }
    });
}

function loadById(req,res,next) {
    MovieModel.findById(req.params.movieId, function(err,movie) {
        if(err) {
            res.status(500).send(err);
        }else if(movie) {
            req.movie = movie;
            next(); // forward the runtime execution
        }else {
            res.status(404).json({
                status: false,
                message: 'movie not found!',
            });
        }
    });
}

function get (req,res) {
    res.json(req.movie);
}

/**
 * Create new movie
 * @property {string} req.body.title - The title of the movie.
 * @returns {Movie}
 */
function create(req,res) {
    var movie = new MovieModel(req.body);
    movie.save(movie);
    res.status(201).send(movie);
}

function update(req,res) {
    req.livro.titulo = req.body.titulo;
    req.livro.autor = req.body.autor;
    req.livro.descricao = req.body.descricao;
    //req.livro.save();
    MovieModel.save(req.livro);
    res.json(req.livro);
}

export default { load, loadById, create, get, update };