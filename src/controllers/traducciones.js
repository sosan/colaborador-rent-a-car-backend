const fetch = require("node-fetch");
const eta = require("eta");
const path = require("path");
const csv2json = require("csvjson-csv2json");

const urlbackend = process.env.URL_BACKEND || "localhost";
const protocolo = "http://";

// const TRADUCCIONES_BACKEND = `${protocolo}${urlbackend}:${process.env.PORT_BACKEND}${process.env.ENDPOINT_TRADUCCIONES_BACKEND}`;
const TRADUCCIONES_GUARDAR = `${protocolo}${urlbackend}:${process.env.PORT_BACKEND}${process.env.ENDPOINT_TRADUCCIONES_GUARDAR}`;
const TRADUCCIONES_ACTUALIZAR = `${protocolo}${urlbackend}:${process.env.PORT_BACKEND}${process.env.ENDPOINT_TRADUCCIONES_ACTUALIZAR}`;

exports.GetTraducciones = async (req, res) =>
{

    // const rawResponse = await fetch(TRADUCCIONES_BACKEND, {
    //     method: "GET",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     credentials: "include"
    // });

    // const datos = await rawResponse.json();
    const html = await eta.renderFileAsync(path.join(__dirname, `../../public/mostrar_traducciones.html`) );

    res.send({
        "html": html,
        // "traducciones": datos.traducciones,
    });


};

exports.GuardarTraducciones = async (req, res) =>
{
    
    const traduccionesRaw = req.body.textoTraduccionesComas;

    try
    {
        const listadoRawTraducciones = csv2json(traduccionesRaw, { separator: "#", parseNumbers: true, transpose: true });

        if (listadoRawTraducciones.length === 0)
        {
            return res.send({ "isOk": false });
        }

        const LISTADO_IDIOMAS = ["en", "es", "it", "de"];
        let listadoTraducciones = {};
        for (let i = 0; i < LISTADO_IDIOMAS.length; i++)
        {

            for (let o = 0; o < LISTADO_IDIOMAS.length; o++)
            {
                if (LISTADO_IDIOMAS[i] === listadoRawTraducciones[o].idioma_web)
                {
                    const keyListadoTraducciones = LISTADO_IDIOMAS[i];
                    listadoTraducciones[keyListadoTraducciones] = listadoRawTraducciones[o];
                    break;
                }

            }

        }

        // console.log(listadoRawTraducciones);
        const rawResponse = await fetch(TRADUCCIONES_GUARDAR, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(listadoTraducciones)
        });
    
        const datos = await rawResponse.json();
        
            res.send({
                "isOk": datos.isOk,
            });

    }
    catch (error)
    {
        console.log("error parsing envio traducciones " + error);
        res.send({"isOk": false});
    }


};

// exports.ActualizarTraducciones = async (req, res) =>
// {

//     try
//     {
//         const rawResponse = await fetch(TRADUCCIONES_ACTUALIZAR, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             credentials: "include",
            
//         });
    
//         const datos = await rawResponse.json();
    
//         res.send({
//             "isOk": datos.isOk,
//         });

//     }
//     catch(error)
//     {
//         console.log("error" + error);
//         if (res !== undefined)
//         {
//             res.send({
//                 "isOk": false,
//             });

//         }
//     }

// };