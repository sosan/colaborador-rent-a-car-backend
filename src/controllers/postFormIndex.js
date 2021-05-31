const dbInterfaces = require("../database/dbInterfaces");
const { EnumMensajesErrores } = require("../errors/exceptions");
const logicInterface = require("../logicinterface/logic_postFormIndex");




exports.GetAllVehicles = async (req, res) =>
{

    const [respuesta, formulario] = await logicInterface.CheckTokenFromGetAllVehicles(req.body);
    if (respuesta.isTokenValid === false) {
        console.error("token invalido");
        return res.send({ "isOk": false });
    }

    if (respuesta.isSchemaValid === false) {
        console.error("Esquema invalido");
        return res.send({ "isOk": false, "errorFormulario": "" });
    }

    const resultados = await logicInterface.GetAllCars(formulario);

    return res.send(resultados);


};



exports.postFormIndex = async (req, res) =>
{
    // chequeos
    const [respuesta, formulario] = await logicInterface.CheckTokenPostForm(req.body);
    if (respuesta.isTokenValid === false)
    {
        console.error("token invalido");
        return res.send({ "isOk": false });
    }

    if (respuesta.isSchemaValid === false)
    {
        console.error("Esquema invalido");
        return res.send({ "isOk": false, "errorFormulario": "" });
    }

    const resultados = await logicInterface.GetCars(formulario);

    return res.send(resultados);
    // // de momento solo pilla los que estan libres, faltaria buscar por poblacion, localidad
    // const cochesPreciosRaw = await logicInterface.GetCarsByReservado(formulario);

    // if (cochesPreciosRaw.isOk === false)
    // {
    //     console.error(`|- ${cochesPreciosRaw.errores}`);
    //     return res.send({
    //         "isOk": false,
    //         "data": [],
    //         "errorFormulario": "error_formulario1",
    //         "diasEntreRecogidaDevolucion": undefined
    //     });

    // }

    // if (cochesPreciosRaw.resultados.length <= 0)
    // {
    //     return res.send({
    //         "isOk": true,
    //         "data": [],
    //         "errorFormulario": "error_formulario2",
    //         "diasEntreRecogidaDevolucion": undefined 
    //     });
    // }

    // const masValorados = await logicInterface.GetMasValorados();

    // const porcentajeVehiculo = await logicInterface.GetPorcentajeVehiculos();

    // const resultadosObjetoCoches = await logicInterface.TransformarResultadosCoche(
    //     cochesPreciosRaw.resultados, 
    //     cochesPreciosRaw.preciosPorClase,
    //     formulario,
    //     cochesPreciosRaw.datosSuplementoGenerico.resultados,
    //     cochesPreciosRaw.datosSuplementoTipoChofer.resultados,
    //     masValorados,
    //     porcentajeVehiculo
    // );
    
    // if (resultadosObjetoCoches.isOk === false) 
    // {
        
    //     console.error(`|- ${resultadosObjetoCoches.errorFormulario}`);
    //     return res.send({
    //         "isOk": false,
    //         "data": [],
    //         "errorFormulario": resultadosObjetoCoches.errorFormulario,
    //         "diasEntreRecogidaDevolucion": resultadosObjetoCoches.diasEntreRecogidaDevolucion
    //     });
    // }

    // return res.send({
    //     "isOk": true,
    //     "data": resultadosObjetoCoches.resultadosCoches,
    //     "datosOrdenacion": cochesPreciosRaw.datosOrdenacion.resultados,
    //     "errorFormulario": resultadosObjetoCoches.errorFormulario,
    //     "diasEntreRecogidaDevolucion": resultadosObjetoCoches.diasEntreRecogidaDevolucion,
    //     "suplementogenerico_base": cochesPreciosRaw.datosSuplementoGenerico.resultados,
    //     "suplementotipochofer_base": cochesPreciosRaw.datosSuplementoTipoChofer.resultados,
    //     "preciosPorClase": cochesPreciosRaw.preciosPorClase,
    //     "condicionesgenerales": cochesPreciosRaw.condicionesgenerales.resultados,
        
    // });

};







