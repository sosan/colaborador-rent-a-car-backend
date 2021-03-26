const apiSchema = require("../schemas/apischema");
const dbInterfaces = require("../database/dbInterfaces");
const { EnumTiposErrores } = require("../errors/exceptions");
 

exports.postFormIndex = async (req, res) =>
{

    const isSchemaValid = await ControlSchema(req.body);

    if (isSchemaValid === false) {
        //TODO: mejorar a redireccion ?
        // blocklist?
        console.error(EnumTiposErrores.EsquemaInvalido);
        return res.send({ "data": "" });
    }

    // de momento solo pilla los que estan libres, faltaria buscar por poblacion, localidad
    const cochesPreciosRaw = await dbInterfaces.GetCarsByReservado(req.body);

    if (cochesPreciosRaw.isOk === false)
    {
        console.error(`|- ${cochesPreciosRaw.errores}`);
        return res.send({ "data": [] });
    }

    if (cochesPreciosRaw.resultados.length <= 0)
    {
        return res.send({"data": [] })
    }

    const preciosPorClase = await dbInterfaces.GetPreciosPorClase();

    if (preciosPorClase.isOk === false)
    {
        console.error(`|- ${preciosPorClase.errores}`);
        return res.send({ "data": [] });
    }

    const resultadosObjetoCoches = await dbInterfaces.TransformarResultadosCoche(
        cochesPreciosRaw.resultados, 
        preciosPorClase.resultados, 
        req.body
    );
    
    // const [resultadosCoches, errorFormulario, diasEntreRecogidaDevolucion]

    if (resultadosObjetoCoches.isOk === false) {
        
        console.error(`|- ${resultadosObjetoCoches.errorFormulario}`);
        return res.send({
            "data": [],
            "errorFormulario": resultadosObjetoCoches.errorFormulario,
            "diasEntreRecogidaDevolucion": resultadosObjetoCoches.diasEntreRecogidaDevolucion
        });
    }

    return res.send({
        "data": resultadosObjetoCoches.resultadosCoches,
        "errorFormulario": resultadosObjetoCoches.errorFormulario,
        "diasEntreRecogidaDevolucion": resultadosObjetoCoches.diasEntreRecogidaDevolucion
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
