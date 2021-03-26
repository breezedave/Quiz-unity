const Koa = require("koa");
const Router = require('koa-router');

class Server {
    constructor(settings) {
        this.settings = settings;
        this.port = process.env.PORT || this.settings.port;
        this.app = new Koa();
        this.server = require('http').createServer(this.app.callback());

        this.handleSockets();
        this.handleApi();
        this.registerServer();
    }

    handleApi = () => {
        const {io} = this;
        const dependencies = {
            io,
        };
        const routes = require("./routes");

        this.router = new Router();

        Object.keys(routes).forEach((method) => {
            Object.keys(routes[method]).forEach((route) => {
                this.router[method](`/api/${route}`, (ctx) => routes[method][route](dependencies, ctx));
            });
        })
    }

    handleSockets = () => {
        this.io = require("socket.io")(this.server);

        const Sockets = require("./sockets");
        const sockets = new Sockets(this.io);

        sockets.registerUser();
    }

    registerServer = () => {
        this.app
        .use(this.router.routes())
        .use(this.router.allowedMethods())
        .use(require('koa-static')("./dist/fe", {
            defer: true,
            index: "index.html",
        }));

        //Sets up both socket & koa listeners
        this.app.listen = (...args) => {
            this.server.listen.call(this.server, ...args);
            return this.server;
        };

        this.app.listen(this.port);
        console.log(`Listening on port ${this.port}`);
    }
}

module.exports = Server;
