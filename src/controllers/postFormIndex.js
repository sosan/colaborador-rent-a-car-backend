const dbInterfaces = require("../database/dbInterfaces");
const { EnumMensajesErrores } = require("../errors/exceptions");
const logicInterface = require("../logicinterface/logic_postFormIndex");
const Joi = require("joi");


exports.postFormIndex = async (req, res) =>
{

    const isTokenValid = await CheckToken(req.body.token, dbInterfaces.tokenFromFrontend);

    if (isTokenValid === false)
    {
        console.error("token invalido");
        return res.send({ "isOk": false });
    }

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
        return res.send({"isOk": false});

    }

    // de momento solo pilla los que estan libres, faltaria buscar por poblacion, localidad
    const cochesPreciosRaw = await logicInterface.GetCarsByReservado(formulario);

    if (cochesPreciosRaw.isOk === false)
    {
        console.error(`|- ${cochesPreciosRaw.errores}`);
        return res.send({
            "isOk": false,
            "data": [],
            "errorFormulario": "error_formulario1",
            "diasEntreRecogidaDevolucion": undefined
        });

    }

    if (cochesPreciosRaw.resultados.length <= 0)
    {
        return res.send({
            "isOk": true,
            "data": [],
            "errorFormulario": "error_formulario2",
            "diasEntreRecogidaDevolucion": undefined 
        });
    }

    const masValorados = await logicInterface.GetMasValorados();

    const resultadosObjetoCoches = await logicInterface.TransformarResultadosCoche(
        cochesPreciosRaw.resultados, 
        cochesPreciosRaw.preciosPorClase,
        formulario,
        cochesPreciosRaw.datosSuplementoGenerico.resultados,
        cochesPreciosRaw.datosSuplementoTipoChofer.resultados,
        masValorados
    );
    
    if (resultadosObjetoCoches.isOk === false) 
    {
        
        console.error(`|- ${resultadosObjetoCoches.errorFormulario}`);
        return res.send({
            "isOk": false,
            "data": [],
            "errorFormulario": resultadosObjetoCoches.errorFormulario,
            "diasEntreRecogidaDevolucion": resultadosObjetoCoches.diasEntreRecogidaDevolucion
        });
    }

    return res.send({
        "isOk": true,
        "data": resultadosObjetoCoches.resultadosCoches,
        "datosOrdenacion": cochesPreciosRaw.datosOrdenacion.resultados,
        "errorFormulario": resultadosObjetoCoches.errorFormulario,
        "diasEntreRecogidaDevolucion": resultadosObjetoCoches.diasEntreRecogidaDevolucion,
        "suplementogenerico_base": cochesPreciosRaw.datosSuplementoGenerico.resultados,
        "suplementotipochofer_base": cochesPreciosRaw.datosSuplementoTipoChofer.resultados,
        "preciosPorClase": cochesPreciosRaw.preciosPorClase,
        "condicionesgenerales": cochesPreciosRaw.condicionesgenerales.resultados
    });

};


const CheckToken = async (token, tokenFromFrontend) => 
{

    let isValid = false;

    if (token === tokenFromFrontend) 
    {
        isValid = true;
    }

    return isValid;
};




// control de schema para comprobar que lo que envia el frontend
// cumple con el schema

const ControlSchema = async (body) => {


    const schema = Joi.object({
        conductor_con_experiencia: Joi.string().required(),
        edad_conductor: Joi.number().required(),
        "fase": Joi.number().required(),
        fechaDevolucion: Joi.string().required(),
        horaDevolucion: Joi.string().required(),
        fechaRecogida: Joi.string().required(),
        horaRecogida: Joi.string().required(),
        "success": Joi.string().required(),
        token: Joi.string().required()
        
    });


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

}
