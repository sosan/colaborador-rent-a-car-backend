const fetch = require("node-fetch");

const urlfrontend = process.env.URL_FRONTEND || "localhost";
const protocolo = "http://";

const TEMPLATE_FRONTEND = `${protocolo}${urlfrontend}:${process.env.PORT_FRONTEND}${process.env.ENDPOINT_TEMPLATE_FRONTEND}`;

exports.MostrarTemplate = async (req, res) =>
{

    // 2 backends 2 frontends
    const rawResponse = await fetch(TEMPLATE_FRONTEND, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(req.body)
    });

    const datos = await rawResponse.json();
    res.send({
        "archivo": datos.archivo,
        "nombreArchivo": datos.nombreArchivo
    });

};



