require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
var compression = require('compression');
const userAgent = require('express-useragent');
const rateLimit = require('express-rate-limit');
const dbInterfaces = require("./database/dbInterfaces");
const router = require('./routes/api');
const cookieParser = require('cookie-parser');

// --- conexion base de datos
dbInterfaces.ConnectDB();


const app = express();

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, //1min
    max: 20
});

app.use(cookieParser());
app.use(compression());
app.use(userAgent.express());
app.use(helmet());
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(express.json({ limit: '2mb' }));
app.use(cors());
app.use(morgan('combined'));


app.use('/', apiLimiter);
app.use('/', router);



app.listen(process.env.NODE_EXPRESS_PORT, (error) => {
        if (error) {
            console.error(`[process ${process.pid}] Error ${error} ${process.env.NODE_EXPRESS_PORT}`);
        }
        console.info(`[process ${process.pid}] Listening at port ${process.env.NODE_EXPRESS_PORT}`);
    }
);

module.exports = app