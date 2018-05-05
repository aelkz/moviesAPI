import { Router } from 'express';
import movies from './movies';
import healthcheck from "./healthcheck";

export default ({ config, db }) => {
    const api = Router();

    api.use('/movies', movies({ config, db }));

    api.use('/healthcheck', healthcheck({ config, db }));

    api.get('/', (req, res) => {
        const description = config.description;
        const version = config.version;
        res.json({ version, description });
    });

    return api;
};