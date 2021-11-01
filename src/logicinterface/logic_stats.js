const Joi = require("joi");
const dbInterfaces = require("../database/dbInterfaces");

// TODO: generar string a partir del secreto
exports.GenerateTokenBackendToFrontend = async () => {

    return process.env.TOKEN_BACKEND_TO_FRONTEND_SECRET;
};


exports.ControlSchemaInit = async (body) => {

    const schema = Joi.object({
        "id": Joi.string().required(),
        "location": Joi.object().required(),
        "token": Joi.string().required(),
        "useragent": Joi.object().required()
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

exports.ControlSchema = async (body) => {

    const schema = Joi.object({
        "id": Joi.string().required(),
        "location": Joi.object().required(),
        "token": Joi.string().required(),
        "useragent": Joi.object().required(),
        "conductor_con_experiencia": Joi.string(),
        "fase": Joi.number()
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


exports.CheckToken = async (res, req, tokenFromFrontend) => {

    let isValid = false;

    if (req.useragent.browser === "node-fetch") {
        isValid = true;
    }
    else {
        isValid = false;
    }

    if (req.body.token === tokenFromFrontend) {
        isValid = true;
    }
    else {
        isValid = false;
    }

    return isValid;

};

exports.SumarVisitaVehiculo = async (vehiculo) => {
    const resultado = await redis_dao.SumarVisitaVehiculo(vehiculo);
    return resultado;

};

exports.AñadirEstadisticas = async (formulario) => {

    formulario["alta"] = new Date(new Date().toUTCString());
    const comprador = {
        "compradorId": formulario.id,
        "faseActual": 1,
        "rutaDatos": [
            {
                "fase": 1,
                ...formulario
            }
        ]

    }

    let isInserted = false;
    let incrementalCount = 1;
    while (isInserted === false)
    {
        isInserted = await dbInterfaces.InsertarPosibleComprador(comprador);
        if (isInserted === false) {
            await sleep(5000 * incrementalCount);
            incrementalCount++;
        }
    }
    return isInserted;

};



exports.AñadirEstadisticasTest = async (formulario, collection) => {

    formulario["alta"] = new Date(new Date().toUTCString());
    const comprador = {
        "compradorId": formulario.id,
        "faseActual": 1,
        "rutaDatos": [
            {
                "fase": 1,
                ...formulario
            }
        ]

    }

    let isInserted = false;
    let incrementalCount = 1;
    while (isInserted === false) {
        isInserted = await dbInterfaces.InsertarPosibleComprador(comprador);
        if (isInserted === false) {
            await sleep(5000 * incrementalCount);
            incrementalCount++;
        }
    }
    return isInserted;

};


const sleep = async (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

};





exports.ActualizarEstadisticas = async (formulario) => {

 

    formulario["alta"] = new Date(new Date().toUTCString());
    formulario["fase"] = formulario["fase"] - 0;
 
    const visitanteActualizado = {
        ...formulario
    };


    let isInserted = false;
    let incrementalCount = 1;
    while (isInserted === false) {
        isInserted = await dbInterfaces.ActualizarPosibleComprador(formulario.success, formulario["fase"], visitanteActualizado);
        if (isInserted === false) {
            await sleep(5000 * incrementalCount);
            incrementalCount++;
        }
    }
    return isInserted;



};
