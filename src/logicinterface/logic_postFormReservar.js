const Joi = require("joi");
const dbInterfaces = require("../database/dbInterfaces");
const logicStats = require("../logicinterface/logic_stats");



// TODO: generar string a partir del secreto
exports.GenerateTokenBackendToFrontend = async () => {

    return process.env.TOKEN_BACKEND_TO_FRONTEND_SECRET;
};


exports.CheckToken = async (res, req, tokenFromFrontend) =>
{

    let isValid = false;

    if (req.useragent.browser === "node-fetch") 
    {
        isValid = true;
    }
    else
    {
        isValid = false;
    }

    if (req.body.token === tokenFromFrontend) {
        isValid = true;
    }
    else
    {
        isValid = false;
    }

    return isValid;

};





exports.ControlSchema = async (body) => {

    const schema = Joi.object({
        "conductor_con_experiencia": Joi.string().required(),
        "fase": Joi.number().required(),
        "location": Joi.object().required(),
        "success": Joi.string().required(),
        "token": Joi.string().required(),
        "useragent": Joi.object().required(),
        "vehiculo": Joi.string().required()
    });

    const options = {
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: false
    };
    const validation = schema.validate(body, options);
    let isValid = false;

    if (validation.error === undefined) {
        isValid = true;
    }

    return isValid;

}



exports.SumarVisitaVehiculo = async (vehiculo) =>
{

    const resultado = await dbInterfaces.SumarVisitaVehiculo(vehiculo);
    return resultado;

};


exports.AñadirEstadisticas = async (formulario) =>
{

    const resultado = await logicStats.AñadirEstadisticas(formulario);
    
};



exports.ActualizarEstadisticas = async (formulario) => {

    const resultado = await logicStats.ActualizarEstadisticas(formulario);


    // const resultado = await logicStats.ActualizarEstadisticas(formulario);



};
