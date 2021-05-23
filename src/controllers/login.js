require('dotenv').config();

const nanoid = require("nanoid");
const Joi = require("joi");
const fetch = require("node-fetch");

const URI_PANEL_CONTROL_BACKEND = `${process.env.URL_BACKEND}:${process.env.PORT_BACKEND}${process.env.ENDPOINT_BACKEND_PANEL_CONTROL_LOGIN_REGISTER}`;


exports.checkRegisterLogin = async (req, res) => 
{

    if (req.body.boton === "registrar")
    {
        //chequear email es admitido
        await Registrar(req, res);
        //enviar al cliente la respuesta
    }
    else if (req.body.boton === "login")
    {

    }

    // const isValidToken = await CheckToken(res, req, dbInterfaces.tokenFromFrontend);
    // if (isValidToken === false) {
    //     return res.send({ "isOk": false });

    // }

    // const isSchemaValid = await logicInterface.ControlSchemaInit(req.body);

    // if (isSchemaValid === false) {
    //     //TODO: mejorar
    //     console.error("control schema invalido");
    //     return res.send({ "isOk": false });
    //     // return res.status(404).send("Not found");

    // }


    

};

const Registrar = async (req, res) =>
{

    // comprobar esquema
    //- -- joi

    const isOk = await CheckEmailUsernamePassword(req.body.username, req.body.email, req.body.password);

    if (isOk === false)
    {
        return res.status(404).send("Not found");
    }

    const body = {
        "tarea": "registrar",
        ...req.body
    }

    const responseRaw = await fetch(URI_PANEL_CONTROL_BACKEND, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body)
    });

    const respuesta = await responseRaw.json();

    if (respuesta.isOk === false || respuesta.usuarioexiste === true)
    {
        return res.status(404).send("Not found");
    }

    res.send({
        success: respuesta.success,

    });

    


};


const CheckEmailUsernamePassword = async (username, email, password) =>
{

    let isOk = true;
    if (username !== "")
    {
        isOk = false;
    }

    if (email === "" || password === "") {
        isOk = false;
    }

    return isOk;

};

const CheckToken = async (res, req, tokenFromFrontend) => {

    let isValid = false;

    // if (req.useragent.browser === "node-fetch") {
    //     isValid = true;
    // }
    // else {
    //     isValid = false;
    // }

    if (req.body.token === tokenFromFrontend)
    {
        isValid = true;
    }
    // else {
    //     isValid = false;
    // }

    return isValid;

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


exports.getLogin = async (req, res) =>
{
    
    const id = nanoid.nanoid();
    res.render("inicio", { "success": id });


};