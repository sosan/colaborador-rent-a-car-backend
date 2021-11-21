const fetch = require("node-fetch");
const dbinterface = require("../database/dbInterfaces");
const protocolo = "http://";
let locations = undefined;

exports.ObtenerTraduccionEmailUsuario = async (lang) =>
{
    if (locations === undefined)
    {
        locations = await dbinterface.GetLocation();
    }

    return locations[lang];

};



exports.GetLocations = async (req, res) => {


    //obtener de la db
    locations = await dbinterface.GetLocation();
    //construir la peticion

    const body = { "token": process.env.TOKEN_BACKEND_TO_FRONTEND_SECRET, datos: locations };
    res.send({"isOk": true, ...body});
    
};


exports.Backend_TO_Frontend = async (req, res) => {


    //obtener de la db
    locations = await dbinterface.GetLocation();

    const body = { "token": process.env.TOKEN_BACKEND_TO_FRONTEND_SECRET, datos: locations };

    let urlfrontend = process.env.URL_FRONTEND || "localhost";
    if (process.env.NODE_ENV === "development")
    {
        urlfrontend = "localhost";
    }
    const URI_FRONTEND_LOCATION = `${protocolo}${urlfrontend}:${process.env.PORT_FRONTEND}${process.env.ENDPOINT_LOCATION}`;
    
    try
    {
        // enviarlo al frontend
        const responseRaw = await fetch(URI_FRONTEND_LOCATION, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(body)
        });
    
        
        const dataResponse = await responseRaw.json();

        if (res !== undefined)
        {
            res.send({"isOk": dataResponse.isOk})

        }
        else
        {
            return dataResponse.isOk;
        }

    }
    catch (error)
    {
        console.log("error" + error);
        if (res !== undefined)
        {
            res.send({ "isOk": false });

        }
        return false;
    }

};