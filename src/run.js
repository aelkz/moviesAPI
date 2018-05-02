import { initApp, bindClusteredApp } from '.';

initApp().then(app => bindClusteredApp(app));