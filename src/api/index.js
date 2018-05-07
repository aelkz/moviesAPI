import { Router } from 'express';
import movies from './routes/movies';
import healthcheck from "./routes/healthcheck";

export default ({ config, db }) => {
    const api = Router();

    api.use(movies({ config, db }));

    api.use(healthcheck({ config, db }));

    api.get('/', (req, res) => {
        const description = config.description;
        const version = config.version;
        res.json({ version, description });
    });

    return api;
};