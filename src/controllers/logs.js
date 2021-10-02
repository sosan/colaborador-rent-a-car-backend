require("dotenv").config();

const fetch = require("node-fetch");
const path = require("path");
const eta = require("eta");

const urlbackend = process.env.URL_BACKEND || "localhost";
const protocolo = "http://";

// const GET_LOGS = `${protocolo}${urlbackend}:${process.env.PORT_BACKEND}${process.env.ENDPOINT_GET_LOGS}`;

exports.GetMainLogs = async (req, res) => 
{

    const html = await eta.renderFileAsync(path.join(__dirname, '../../public/logs.html'));

    res.send({
        html: html,
    });


};

