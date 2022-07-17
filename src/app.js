const {
    BODY_LIMIT,
    NODE_ENV,
    PORT,
    DB
} = process.env;
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const logger = require('./helpers/logger');
const Router = require('./routes');
const packageJson = require('../package.json');
const InstanceManagementService = require('./helpers/dbManagement/InstanceManagementService');
const { engine } = require('express-handlebars');
const Normalizador = require('./models/normalizador');
const normalizer = new Normalizador();
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const dbManagement = new InstanceManagementService().build(DB);
let { DaoProduct } = dbManagement;
DaoProduct = new DaoProduct();
let MensajeController  = require('./controllers/mensaje');
MensajeController = new MensajeController();



class App {
    constructor() {
        this.dbManagement = dbManagement;
        this.app = express();
        this.httpServer = new HttpServer(this.app);
        this.io = new IOServer(this.httpServer);        
    }

    _onListening() {
        logger.info(`Started ${packageJson.name} at port ${PORT} in ${NODE_ENV} environment`);
    }

    _onError(err) {
        logger.error(`App Crashed, Error: ${err.errorMessage}`);
        process.exit;
    }

    _configure() {
        this._middleWares();
        return this._routes();
    }

    _middleWares() {
        this.app.use(bodyParser.json({limit: BODY_LIMIT}));
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(express.static(path.resolve('public')));
        this.app.use(cookieParser());
        this.app.use(morgan('dev'));
        this.app.use(cors({
            credentials: true,
            origin: /^http:\/\/localhost/
        }));
        return;
    }
    _webSocket() {
io.on('connection', async socket => {
    console.log('Nueva conexión');

    socket.emit('productos',await productos.getAll());

    socket.on('new-product', async producto => {
        await DaoProduct.addProduct(producto);
        io.sockets.emit('productos', await DaoProduct.getAll());
    })

    const mensajes = await mensajero.getAll();
    const data = normalizer.getDataNormalized(mensajes)

    socket.emit('mensajes', data);

    socket.on('new-message', async mensaje => {
        try {
            await MensajeController.save(mensaje)    
        } catch (error) {
            console.log(error);
        }

        const mensajes = await MensajeController.getAll();
        const data = normalizer.getDataNormalized(mensajes)

        socket.emit('mensajes', data);
    })
});
    }

    async _routes() {
        Router.configure(this.app);
        return;
    }

    async init() {
        await this._configure();
        this.httpServer.listen(PORT, this._onListening);
        this.app.on('error', this._onError);
        return this.app;
    }    
}

module.exports = App;