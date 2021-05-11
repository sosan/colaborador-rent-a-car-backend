const fetch = require("node-fetch");
const dbinterface = require("../database/dbInterfaces");
const URI_LOCATIONS = `${process.env.URL_FRONTEND}:${process.env.PORT_FRONTEND}${process.env.ENDPOINT_LOCATION}`;


exports.GetLocations = async (req, res) => {


    //obtener de la db
    const datos = await dbinterface.GetLocation();
    //construir la peticion

    const body = { "token": process.env.TOKEN_BACKEND_TO_FRONTEND_SECRET, datos: datos };
    res.send({"isOk": true, ...body});
    
};


exports.Backend_TO_Frontend = async (req, res) => {


    //obtener de la db
    const datos = await dbinterface.GetLocation();

    const body = { "token": process.env.TOKEN_BACKEND_TO_FRONTEND_SECRET, datos: datos };

    // enviarlo al frontend
    const responseRaw = await fetch(URI_LOCATIONS, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body)
    });

    const dataResponse = await responseRaw.json();
    // res.send({"isOk": dataResponse.isOk});

    if (dataResponse.isOk === true)
    {


    }


};