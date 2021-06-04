const Joi = require("joi");
const dbInterfaces = require("../database/dbInterfaces");
const logicStats = require("../logicinterface/logic_stats");



// TODO: generar string a partir del secreto
const GenerateTokenBackendToFrontend = async () => {

    return process.env.TOKEN_BACKEND_TO_FRONTEND_SECRET;
};



exports.CheckTokenPostForm = async (formulario) => {

    const schema = Joi.object({
        token: Joi.string().required(),
        useragent: Joi.object().required(),
        descripcion_vehiculo: Joi.string().required(),
        fechaRecogida: Joi.string().required(),
        horaRecogida: Joi.string().required(),
        fechaDevolucion: Joi.string().required(),
        horaDevolucion: Joi.string().required(),
        dias: Joi.number().required(),
        alquiler: Joi.number().required(),
        total_suplmento_tipo_conductor: Joi.number().required(),
        pagoRecogida: Joi.number().required(),
        pago_online: Joi.number().required(),
        titulo: Joi.string().required(),
        child_seat: Joi.number().required(),
        booster_seat: Joi.number().required(),
        conductor_con_experiencia: Joi.string().required(),
        

    });

    const [respuesta, formularioChecked] = await CheckTokenControlSchema(formulario, schema);

    return [respuesta, formularioChecked];

};

const CheckTokenControlSchema = async (formulario, schema) => {

    let respuesta = {};

    const isTokenValid = await CheckToken(formulario.token, dbInterfaces.tokenFromFrontend);
    respuesta["isTokenValid"] = isTokenValid;

    if (isTokenValid === false) {
        return respuesta;
    }

    // TODO: generar string a partir del secreto
    formulario["token"] = await GenerateTokenBackendToFrontend();
    if (formulario.conductor_con_experiencia === undefined) {
        formulario["conductor_con_experiencia"] = "off";
    }

    respuesta["isSchemaValid"] = await ControlSchema(formulario, schema);

    return [respuesta, formulario];

};


const CheckToken = async (token, tokenFromFrontend) => {

    let isValid = false;

    if (token === tokenFromFrontend) {
        isValid = true;
    }

    return isValid;
};

const ControlSchema = async (body, schema) => {

    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: false // remove unknown props
    };
    const validation = schema.validate(body, options);
    let isValid = false;

    if (validation.error === undefined) {
        isValid = true;
    }

    return isValid;

};



// exports.CheckToken = async (res, req, tokenFromFrontend) =>
// {

//     let isValid = false;

//     if (req.useragent.browser === "node-fetch") 
//     {
//         isValid = true;
//     }
//     else
//     {
//         isValid = false;
//     }

//     if (req.body.token === tokenFromFrontend) {
//         isValid = true;
//     }
//     else
//     {
//         isValid = false;
//     }

//     return isValid;

// };





// exports.ControlSchema = async (body) => {

//     const schema = Joi.object({
//         "conductor_con_experiencia": Joi.string().required(),
//         "fase": Joi.number().required(),
//         "location": Joi.object().required(),
//         "success": Joi.string().required(),
//         "token": Joi.string().required(),
//         "useragent": Joi.object().required(),
//         "vehiculo": Joi.string().required()
//     });

//     const options = {
//         abortEarly: false,
//         allowUnknown: false,
//         stripUnknown: false
//     };
//     const validation = schema.validate(body, options);
//     let isValid = false;

//     if (validation.error === undefined) {
//         isValid = true;
//     }

//     return isValid;

// }



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
