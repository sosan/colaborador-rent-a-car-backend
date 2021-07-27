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
    const rateLimit = require("express-rate-limit");
    const dbInterfaces = require("./database/dbInterfaces");

    // --- conexion base de datos
    dbInterfaces.ConnectDB();
    
    const router = require("./routes/routes");
    const cookieParser = require("cookie-parser");
    
    app = express();
    
    const apiLimiter = rateLimit({
        windowMs: 1 * 60 * 1000, //1min
        max: 20
    });
    
    app.use(cookieParser());
    app.use(compression());
    app.use(userAgent.express());
    app.use(helmet());
    app.use(express.urlencoded({ extended: true, limit: "2mb" }));
    app.use(express.json({ limit: "2mb" }));
    app.use(cors());
    app.use(morgan("combined"));
    
    
    app.use("/", apiLimiter);
    app.use("/", router);
    
    const listadoIP = await GetIP();
    
    app.listen(process.env.PORT_BACKEND, (error) => {
            if (error) {
                console.error(`[process ${process.pid}] Error ${error} ${listadoIP} at ${process.env.PORT_BACKEND}`);
            }
        console.info(`[process ${process.pid}] Listening ${listadoIP} at ${process.env.PORT_BACKEND}`);
        }
    );
    
};

exports.app = app;

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

