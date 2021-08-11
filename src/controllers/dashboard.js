require("dotenv").config();

const fetch = require("node-fetch");
const path = require("path");

const urlbackend = process.env.URL_BACKEND || "localhost";
const protocolo = "http://";

const GET_GENERAL_STATS = `${protocolo}${urlbackend}:${process.env.PORT_BACKEND}${process.env.ENDPOINT_GET_GENERAL_STATS}`;



exports.GetDashboard = async (req, res) =>
{

    console.log("apunto enviar a dashboard de backend")
    const rawResponse = await fetch(GET_GENERAL_STATS, {
        method: "GET",
        // headers: {
        //     "Content-Type": "application/json",
        // },
        credentials: "include"
    });

    const datos = await rawResponse.json();
    
    res.render(path.join(__dirname, '../../public/dashboard.html'), {
        "stats": datos.statsRaw
    });

};

exports.RedirectGetDashboard = async (req, res) => {

    res.redirect("/dashboard");

};
