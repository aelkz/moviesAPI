import { initApp, bindClusteredApp } from '.';

var config = require('../config/config');

initApp(config).then(app => bindClusteredApp(app));