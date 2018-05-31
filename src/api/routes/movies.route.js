import { Router } from 'express';
import controller from '../controller/movies.controller';
import requirements from '../validation/movies.validation';
import validate from 'express-validation';

/*
    GET — retrieve a particular resource’s object or list all objects
    POST — create a new resource’s object
    PATCH — make a partial update to a particular resource’s object
    PUT — completely overwrite a particular resource’s object
    DELETE — remove a particular resource’s object
 */

export default () => {
    const api = Router();

    /***********************************************************************
     * URI used for search (GET) and saving (POST) movies                  *
     * ********************************************************************/
    api.route('/movies')
    .get(controller.get)
    .post(validate(requirements.createMovie), controller.create);

    /************************************************************************
     * URI used for search followed by update (PUT), partial update (PATCH) *
     * or removal (DELETE)                                                  *
     * *********************************************************************/
    api.route('/movies/:id')
        .get(controller.getById)
        .put(controller.update)
        .patch(controller.patch)
        .delete(controller.remove);

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

    return api;
};