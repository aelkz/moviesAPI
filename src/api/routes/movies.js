import { Router } from 'express';
import MovieModel from '../models/movie';

export default () => {
    // express.Router
    const api = Router();

    /**
     Provide Api for Model

     Model list  GET /api/v1/api.models

     @header
        Authorization: Bearer {token}
     @optionalQueryParameters
        param1 {String} - description
        param2 {String} - description

     Model create  POST /api/v1/api.models
     @header
        Authorization: Bearer {token}
     @params
         param1 {string}
         param2 {boolean}
     **/

    /************************************************************************
     * RESOURCE 01 - /movies                                                *
     * URI para busca (GET) e cadastro (POST) de livros                     *
     * *********************************************************************/
    api.route('/movies')
    .get(function(req,res) {
        MovieModel.find(function(err,movies) {
            if(err) {
                debug(err.red.bold);
                res.status(500).send(err);
            }else {
                res.json(movies);
            }
        });
    })
    .post(function(req,res) {
            /*
            "title": "",
            "parentalGuidance": "",
            "description": "",
            "genreList": [],
            "runtime": "",
            "imdb": "",
            "rating": "",
            "metascoreRating": "",
            "directorsList": [],
            "castList": [],
            "storyLine": "",
            "aspectRatio": "",
            "releaseDate": "",
            "country": "",
            "language": ""
            */

            //validation
            req.assert('title','title is required').notEmpty();
            req.assert('parentalGuidance','parentalGuidance is required').notEmpty();
            req.assert('description','description is required').notEmpty();
            req.assert('genreList','genreList is required').notEmpty();
            req.assert('runtime','runtime is required').notEmpty();
            req.assert('directorsList','directorsList is required').notEmpty();
            req.assert('castList','castList is required').notEmpty();

            var errors = req.validationErrors();

            if(errors){
                res.status(422).json(errors);
                return;
            }

            var movie = new MovieModel(req.body);
            movie.save(movie);
            res.status(201).send(movie);
        });

    /*------------------------------------------------------
    route.all is extremely useful. you can use it to do
    stuffs for specific routes. for example you need to do
    a validation everytime route /api/user/:user_id it hit.

    remove api.all() if you dont want it
    ------------------------------------------------------*/
    //api.all(function(req,res,next){
    //    console.log("You need to do something about api Route? Do it here");
    //    console.log(req.params);
    //    next();
    //});

    /************************************************************************
     * RESOURCE 02 INTERNO - /movies/:movieId                               *
     * URI used for search of an movie by ID (findById) for being used as   *
     * premise to PUT and PATCH operations. It's used for pre-load the      *
     * movie object from database.                                          *
     * *********************************************************************/
    api.use('/movies/:movieId', function(req,res,next) {
        MovieModel.findById(req.params.movieId, function(err,movie) {
            if(err) {
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
    });

    /************************************************************************
     * RESOURCE 02 - /movies/:movieId                                       *
     * URI used for search w/ update (PUT)
     * *********************************************************************/
    api.route('/movies/:movieId')
        .get(function(req,res) {
            res.json(req.movie);
        })
        .put(function(req,res) {

            req.livro.titulo = req.body.titulo;
            req.livro.autor = req.body.autor;
            req.livro.descricao = req.body.descricao;
            //req.livro.save();
            MovieModel.save(req.livro);
            res.json(req.livro);
        });

    /*
    import asyncWrap from 'express-async-wrapper';
    api.get('/livros', asyncWrap(async (req, res) => {
        ...
    }));
    */

    return api;
};