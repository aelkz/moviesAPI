import { Router } from 'express';

/*------------------------------------------------------
*  This is router middleware,invoked everytime
*  we hit url /api and anything after /api
*  like /api/user , /api/user/7
*  we can use this for doing validation,authetication
*  for every route started with /api
--------------------------------------------------------*/
export default ({ config, db }) => {
    const router = Router();

    // add middleware here
    //router.use(function(req, res, next) {
    //    console.log(req.method, req.url);
    //    next();
    //});

    return router;
};