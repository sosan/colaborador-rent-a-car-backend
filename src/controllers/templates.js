const fetch = require("node-fetch");
const eta = require("eta");
const path = require("path");

const urlfrontend = process.env.URL_BACKEND || "localhost";
const protocolo = "http://";

const TEMPLATE_FRONTEND = `${protocolo}${urlfrontend}:${process.env.PORT_BACKEND}${process.env.ENDPOINT_TEMPLATE_FRONTEND}`;


exports.GetMainTemplates = async (req, res) =>
{
    const html = await eta.renderFileAsync(path.join(__dirname, '../../public/mostrar_templates.html'));

    res.send({
        html: html,
    });

};


exports.MostrarTemplate = async (req, res) =>
{

    
    const rawResponse = await fetch(TEMPLATE_FRONTEND, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(req.body)
    });

    const datos = await rawResponse.json();

    const html = await eta.renderFileAsync(path.join(__dirname, `../../public/template_paginas.html`), 
        { datos: datos, accion: req.body.accion }
    );

    res.send({
        html: html,
    });


};