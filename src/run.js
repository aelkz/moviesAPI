import { initApp, bindClusteredApp } from './index';

require('babel-core/register');

var config  = require('../config/config');

initApp(config).then(app => bindClusteredApp(app));
