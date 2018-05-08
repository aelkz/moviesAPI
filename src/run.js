import { initApp, bindClusteredApp } from './index';

var config  = require('../config/config');

initApp(config).then(app => bindClusteredApp(app));
