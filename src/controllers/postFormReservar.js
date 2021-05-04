const Joi = require("joi");
const dbInterfaces = require("../database/dbInterfaces");
const { EnumMensajesErrores } = require("../errors/exceptions");
const logicInterface = require("../logicinterface/logic_postFormReservar");

exports.postFormReservar = async (req, res) => 
{

    await CheckToken(res, req.body.token, dbInterfaces.tokenFromFrontend);
    
    let formulario = req.body;
    // TODO: generar string a partir del secreto
    formulario["token"] = await logicInterface.GenerateTokenBackendToFrontend();
    if (formulario.conductor_con_experiencia === undefined)
    {
        formulario["conductor_con_experiencia"] = "off";
    }

    const isSchemaValid = await ControlSchema(formulario);

    if (isSchemaValid === false) {
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

    


};


const CheckToken = async (res, token, tokenFromFrontend) => 
{
    if (token === undefined || token !== tokenFromFrontend) 
    {
        return res.status(404).send({});
    }

};





const ControlSchema = async (body) => {

    const schema = Joi.object({
        "token": Joi.string().required(),
        "conductor_con_experiencia": Joi.string().required(),
        "vehiculo": Joi.string().required()
    });

    const options = {
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: false
    };
    const validation = schema.validate(body, options);
    let isValid = false;

    if (validation.error === undefined)
    {
        isValid = true;
    }

    return isValid;

}