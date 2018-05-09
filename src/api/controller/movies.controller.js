import MovieModel from '../models/movie.model';

function load(req,res) {
    MovieModel.find(function(err,movies) {
        if(err) {
            console.log('ddd1');
            //debug(err.red.bold);
            res.status(500).send(err);
        }else {
            res.json(movies);
        }
    });
}

function loadById(req,res,next) {
    MovieModel.findById(req.params.movieId, function(err,movie) {
        if(err) {
            console.log('eee1');
            res.status(500).send(err);
        }else if(movie) {
            req.movie = movie;
            next(); // forward the runtime execution
        }else {
            res
                .status(404)
                .json({
                    status: false,
                    message: 'movie not found!',
                });
        }
    });
}

function get (req,res) {
    res.json(req.movie);
}

function create(req,res) {
    console.log('x1');

    var errors = req.validationErrors();

    console.log('x2');

    if(errors){
        res.status(422).json(errors);
        return;
    }

    console.log('x3');

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