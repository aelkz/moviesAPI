const Joi = require('joi');

export default {
    // POST /movies
    createMovie: {
        body: {
            title: Joi.string().min(1).required(),
            parentalGuidance: Joi.string().min(3).required(),
            description: Joi.string().min(10).required(),
            genreList: Joi.array().items(Joi.string().valid('Action','Adventure','Animation','Biography','Comedy','Crime','Documentary','Drama',
                'Family','Fantasy','Film Noir','History','Horror','Music','Musical','Mystery','Romance',
                'Sci-Fi','Short','Sport','Superhero','Thriller','War','Western')).min(1),
            runtime: Joi.string().regex(/^[1-9]{3}$/).required()
        }
    }
};

/*
    // **************************************************
    // https://github.com/hapijs/joi/issues/1124
    // email: joi.string().email().required(),
    // stringList: Joi.array().items(joi.string()).required(),
    // UPDATE /api/users/:userId
    updateUser: {
        body: {
            username: Joi.string().required(),
            mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
        },
        params: {
            userId: Joi.string().hex().required()
        }
    },
    // UPDATE /api/posts/:postId
    updatePost: {
        body: {
            title: Joi.string().required(),
        },
        params: {
            postId: Joi.string().hex().required()
        }
    }

 */