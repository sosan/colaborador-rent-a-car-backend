const Joi = require("joi");
const dbInterfaces = require("../database/dbInterfaces");


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

    if (req.body.token !== undefined || req.body.token === tokenFromFrontend) {
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
        "success": Joi.string().required(),
        "fase": Joi.string().required(),
        "conductor_con_experiencia": Joi.string().required(),
        "location": Joi.object().required(),
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


exports.AñadirComprador = async (formulario) =>
{

    formulario["alta"] = new Date(new Date().toUTCString()); //new Date()
    const comprador = {
        "compradorId": formulario.success,
        "faseActual": formulario.fase,
        "rutaDatos": 
            {
                "fase": formulario.fase,
                ...formulario
            }
        
    }

    const resultado = dbInterfaces.InsertarPosibleComprador(comprador);

};

