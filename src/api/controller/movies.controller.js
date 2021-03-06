'use strict';

import repository from '../repository/movies.repository';

/**
 * Get movie by id
 * @property {string} req.params.id - The id of the movie.
 * @returns {Movie}
 */
const getById = async(req, res, next) => {
    try {
        var data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(404).send({
            message: 'movie ' + req.params.movieId + ' not found!'
        });
    }
};

/**
 * Get movie
 * @returns {Movie[]}
 */
const get = async(req, res, next) => {
    try {
        var collection = await repository.get();
        res.status(200).send(collection);
    } catch (e) {
        res.status(500).send({
            message: e.message
        });
    }
};

/**
 * Create new movie
 * @property {string} req.body.title - The title of the movie.
 * ...
 * @returns {Movie}
 */
const create = async(req, res, next) => {
    try {
        const movie = await repository.create(req.body);
        res.status(201).send(movie);
    }catch (e) {
        res.status(500).send({
            message: e.message
        });
    }
};

/**
 * Update movie
 * @property {string} req.params.id - The id of the movie.
 * @returns void
 */
const update = async(req, res, next) => {
    try {
        const movie = await repository.update(req.params.id, req.body);
        res.status(204).send(movie);
    }catch (e) {
        res.status(500).send({
            message: e.message
        });
    }
};

/**
 * Patch movie
 * @property {string} req.params.id - The id of the movie.
 * @returns void
 */
const patch = async(req, res, next) => {
    try {
        const movie = await repository.patch(req.params.id, req.body);
        res.status(204).send(movie);
    }catch (e) {
        res.status(500).send({
            message: e.message
        });
    }
};

/**
 * Delete movie
 * @property {string} req.params.id - The id of the movie.
 * @returns void
 */
const remove = async(req, res, next) => {
    try {
        await repository.remove(req.params.id);
        res.status(302).send({
            message: 'movie ' + req.params.id + ' removed.'
        });
    }catch (e) {
        //res.setHeader('Location', 'http://' + req.headers['host'] + '/movies');
        res.status(404).send({
            message: 'movie ' + req.params.id + ' not found!'
        });
    }
};

export default { get, getById, create, remove, update, patch };