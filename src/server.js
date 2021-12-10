let app = undefined;

exports.InitServer = async () =>
{
    require("dotenv").config();
    const cors = require("cors");
    const morgan = require("morgan");
    const helmet = require("helmet");
    const express = require("express");
    const compression = require("compression");
    const userAgent = require("express-useragent");
    
    const dbInterfaces = require("./database/dbInterfaces");

    // --- conexion base de datos
    dbInterfaces.ConnectDB();
    
    const router = require("./routes/routes");
    const cookieParser = require("cookie-parser");

    app = express();
    app.use(cookieParser());
    app.use(compression());
    app.use(userAgent.express());
    app.use(helmet());
    app.use(express.urlencoded({ extended: true, limit: "2mb" }));
    app.use(express.json({ limit: "2mb" }));
    app.use(cors());
    app.use(morgan("combined"));
    app.use("/", router);
    
    const localhostIP = await GetIP();
    
    const express_server = app.listen(process.env.PORT_BACKEND, (error) => {
            if (error) {
                console.error(`[process ${process.pid}] Error ${error} ${localhostIP} at ${process.env.PORT_BACKEND}`);
            }
        console.info(`[process ${process.pid}] Listening ${localhostIP} at ${process.env.PORT_BACKEND}`);
        }
    );

    process.on("SIGINT", function onSigint() {
        console.info("Got SIGINT (aka ctrl-c). Graceful shutdown ", new Date().toISOString());
        shutdown();
    });

    process.on("SIGTERM", function onSigterm() {
        console.info("Got SIGTERM (stop). Graceful shutdown ", new Date().toISOString());
        shutdown();
    })

    // shut down server
    const shutdown = () => {

        express_server.close(function onServerClosed(err) {
            if (err) {
                console.error(err);
                process.exitCode = 1;
            }
            process.exit();
        })
    };
    
};    

const GetIP = async () =>
{
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    let listadoIPs = "";

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) 
        {
            if (net.family === 'IPv4' && !net.internal) {
                listadoIPs = net.address;
                break;
            }
        }
    }

    return listadoIPs;

};

exports.app = app;