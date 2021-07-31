const fetch = require("node-fetch");
const eta = require("eta");
const path = require("path");

const urlbackend = process.env.URL_BACKEND || "localhost";
const protocolo = "http://";

const TEMPLATE_FRONTEND = `${protocolo}${urlbackend}:${process.env.PORT_BACKEND}${process.env.ENDPOINT_TEMPLATE_FRONTEND}`;
const DETALLE_TEMPLATE_FRONTEND = `${protocolo}${urlbackend}:${process.env.PORT_BACKEND}${process.env.ENDPOINT_DETALLE_TEMPLATE_FRONTEND}`;

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


exports.DetalleTemplate = async (req, res) =>
{

    const rawResponse = await fetch(DETALLE_TEMPLATE_FRONTEND, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(req.body)
    });

    const datos = await rawResponse.json();

    res.send({
        resultado: datos,
    });

};
