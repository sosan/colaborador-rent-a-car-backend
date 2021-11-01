const Joi = require("joi");
const dbInterfaces = require("../database/dbInterfaces");
const logicInterface = require("../logicinterface/logic_stats");
const logicPostForm = require("../logicinterface/logic_postFormReservar");

exports.PostInitStats = async(req, res) =>
{

    const isValidToken = await logicInterface.CheckToken(res, req, dbInterfaces.tokenFromFrontend);
    if (isValidToken === false) {
        return res.send({ "isOk": false });

    }

    const isSchemaValid = await logicInterface.ControlSchemaInit(req.body);

    if (isSchemaValid === false) {
        //TODO: mejorar
        console.error("control schema invalido");
        return res.send({"isOk": false});
        
    }
    
    res.send({"isOk": true});
    await logicInterface.AñadirEstadisticas(req.body);

};


exports.ActualizarStats = async (req, res) =>
{

    const isValidToken = await logicInterface.CheckToken(res, req, dbInterfaces.tokenFromFrontend);
    if (isValidToken === false) {
        return res.send({ "isOk": false });
    }


    let formulario = req.body;
    // TODO: generar string a partir del secreto
    formulario["token"] = await logicInterface.GenerateTokenBackendToFrontend();
    if (formulario.conductor_con_experiencia === undefined) {
        formulario["conductor_con_experiencia"] = "off";
    }

    const isSchemaValid = await logicInterface.ControlSchema(formulario);

    if (isSchemaValid === false) {
        //TODO: mejorar a redireccion ?
        // blocklist?
        console.error("postFormReservar > Esquema invalido");
        return res.send({ "isOk": false });

    }

    res.send({ "isOk": true });

    await logicInterface.ActualizarEstadisticas(formulario);



};
