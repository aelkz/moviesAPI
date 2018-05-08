import { Router } from 'express';
import validate from 'express-validator';
import movieCtrl from '../controller/movies.controller';
import validationRules from '../validation/movies.validation';

// import validate from 'express-validation';
// import paramValidation from '../config/param-validation';

/*
    GET — retrieve a particular resource’s object or list all objects
    POST — create a new resource’s object
    PATCH — make a partial update to a particular resource’s object
    PUT — completely overwrite a particular resource’s object
    DELETE — remove a particular resource’s object
 */

export default () => {
    const api = Router();

    /************************************************************************
     * RESOURCE 01 - /movies                                                *
     * URI para busca (GET) e cadastro (POST) de livros                     *
     * *********************************************************************/
    api.route('/movies')
    .get(movieCtrl.load)
    .post(validate(validationRules.createMovie), movieCtrl.create);

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
    api.use('/movies/:movieId', movieCtrl.loadById);

    /************************************************************************
     * RESOURCE 02 - /movies/:movieId                                       *
     * URI used for search w/ update (PUT)
     * *********************************************************************/
    api.route('/movies/:movieId')
        .get(movieCtrl.get)
        .put(movieCtrl.update);

    return api;
};