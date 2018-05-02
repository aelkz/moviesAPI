import { Router } from 'express';
import { version } from '../../package.json';
import movies from './movies';
import healthcheck from "./healthcheck";

export default ({ config, db }) => {
    const api = Router();

    api.use('/movies', movies({ config, db }));

    api.use('/healthcheck', healthcheck({ config, db }));

    api.get('/', (req, res) => {
        const protocolVersion = 1;
        res.json({ version, protocolVersion });
    });

    return api;
};