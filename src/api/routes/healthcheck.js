import { Router } from 'express';

const healthcheck = require('../controller/healthcheck.controller');

export default () => {
    // express.Router
    const api = Router();

    api.route('/healthcheck')
        .get(healthcheck.get);

    return api;
};