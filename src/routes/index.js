const {Router} = require('express');
const {
    errorHandler
} = require('./middleWares');

const Errors = require('../helpers/error')
const Logger = require('../helpers/logger');

class Routes {
    static configure(app) {
        Logger.info('Loading api...');
        app.use('/api', require('./api')(Router()));
        app.use(errorHandler);
        //app.get('/', (_, res) => Errors.send404(res));
        //app.use('*', (_, res) => Errors.sendError(res));        
    }
}

module.exports = Routes;
