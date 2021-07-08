require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const session = require('express-session');
const eta = require("eta");
var compression = require("compression");
const userAgent = require("express-useragent")
const rateLimit = require("express-rate-limit");
const router = require("./routes/router");
const path = require("path");

const app = express();

// const apiLimiter = rateLimit({
//     windowMs: 1 * 60 * 1000, //1min
//     max: 20
// });

// const allowlist = [`${process.env.URL_FRONTEND}:${process.env.PORT_BACKEND}`];

// app.use(session({ secret: process.env.SECRET_SESSION, resave: false, saveUninitialized: false }));
app.use(compression());
// app.use(userAgent.express())
// app.use(helmet());
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(express.json({ limit: "2mb" }));
// app.use(cors({
//     credentials: true,
//     origin: allowlist
// }));
// app.use(morgan("combined"));


//registro de html como eta
app.engine(".html", eta.renderFile);
app.set("views", path.join(__dirname, "../public"));
app.set("view engine", "html");

app.use("/", express.static("public"));


// app.use("/", apiLimiter);
app.use("/", router);


app.listen(process.env.PORT_BACKOFFICE, (error) => {
        if (error) {
            console.error(`[process ${process.pid}] Error ${error} ${process.env.PORT_BACKOFFICE}`);
        }
    console.info(`[process ${process.pid}] Listening at port ${process.env.PORT_BACKOFFICE}`);
    }
);