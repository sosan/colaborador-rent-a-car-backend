const apiSchema = require("../schemas/apischema");
const dbInterfaces = require("../database/dbInterfaces");
const { EnumMensajesErrores } = require("../errors/exceptions");
const logicInterface = require("../logicinterface/logic_postFormIndex");  

exports.postFormIndex = async (req, res) =>
{

    if (req.body.token === undefined || req.body.token !== dbInterfaces.tokenFromFrontend)
    {
        return res.status(404).send({});
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
        res.redirect(404, "/");
    }

    

    // de momento solo pilla los que estan libres, faltaria buscar por poblacion, localidad
    const cochesPreciosRaw = await logicInterface.GetCarsByReservado(formulario);

    if (cochesPreciosRaw.isOk === false)
    {
        console.error(`|- ${cochesPreciosRaw.errores}`);
        return res.send({
            "isOk": false,
            "data": [],
            "errorFormulario": "Disculpe las molestias. Gracias.",
            "diasEntreRecogidaDevolucion": undefined
        });

    }

    if (cochesPreciosRaw.resultados.length <= 0)
    {
        return res.send({
            "isOk": true,
            "data": [],
            "errorFormulario": "Sentimos informarle que no disponemos de ningún vehículo para las fechas solicitadas. Disculpe las molestias. Gracias.",
            "diasEntreRecogidaDevolucion": undefined 
        });
    }

    const resultadosObjetoCoches = await logicInterface.TransformarResultadosCoche(
        cochesPreciosRaw.resultados, 
        cochesPreciosRaw.preciosPorClase,
        formulario,
        cochesPreciosRaw.datosSuplementoGenerico.resultados,
        cochesPreciosRaw.datosSuplementoTipoChofer.resultados
    );
    
    if (resultadosObjetoCoches.isOk === false) {
        
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




// control de schema para comprobar que lo que envia el frontend
// cumple con el schema
const ControlSchema = async (body) => {

    const tamanyoBody = Object.keys(body).length;
    if (tamanyoBody <= 0 || tamanyoBody > apiSchema.length) return false;

    let isValid = false;
    for (key in body) {
        if (body[key] === "" || body[key] === undefined) {
            return false;
        }

        let schemaValid = isValid = false;
        for (let i = 0; i < apiSchema.length; i++) {
            if (key === apiSchema[i]) {
                schemaValid = true;
                isValid = true;
                break;
            }
        }

        //TODO: controla hora y fecha introducidas

        if (schemaValid === false) {
            return false;
        }

    }

    return isValid;
}
