const Joi = require("joi");
const dbInterfaces = require("../database/dbInterfaces");
const logicInterface = require("../logicinterface/logic_stats");

exports.PostInitStats = async(req, res) =>
{

    const isValidToken = await logicInterface.CheckToken(res, req, dbInterfaces.tokenFromFrontend);
    if (isValidToken === false) {
        return res.send({ "isOk": false });

    }

    const isSchemaValid = await ControlSchema(req.body);

    if (isSchemaValid === false) {
        //TODO: mejorar
        console.error("control schema invalido");
        return res.status(404).send("Not found");
        
    }
    else
    {
        res.send({"isOk": true});
    }

    logicInterface.AñadirEstadisticas(req.body);

};

const ControlSchema = async (body) => {

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