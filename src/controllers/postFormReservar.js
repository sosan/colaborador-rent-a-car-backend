const dbInterfaces = require("../database/dbInterfaces");
const { EnumMensajesErrores } = require("../errors/exceptions");
const logicInterface = require("../logicinterface/logic_postFormReservar");


exports.postFormReservar = async (req, res) => 
{

    const isValidToken = await logicInterface.CheckToken(res, req, dbInterfaces.tokenFromFrontend);
    if (isValidToken === false)
    {
        return res.send({"isOk": false});

    }


    
    let formulario = req.body;
    // TODO: generar string a partir del secreto
    formulario["token"] = await logicInterface.GenerateTokenBackendToFrontend();
    if (formulario.conductor_con_experiencia === undefined)
    {
        formulario["conductor_con_experiencia"] = "off";
    }

    const isSchemaValid = await logicInterface.ControlSchema(formulario);

    if (isSchemaValid === false) 
    {
        //TODO: mejorar a redireccion ?
        // blocklist?
        console.error("Esquema invalido");
        return res.send({ "isOk": false });

    }
    
    const resultado = await logicInterface.SumarVisitaVehiculo(formulario.vehiculo);

    if (resultado === undefined)
    {
        console.log(`no se ha sumado +1 al vehiculo ${vehiculo}`);
    }

    const x = logicInterface.AñadirComprador(formulario);

    
    // x["rutaDatos"].push(rutaDatos);



};

