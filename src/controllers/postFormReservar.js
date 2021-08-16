
const logicInterface = require("../logicinterface/logic_postFormReservar");

exports.postRealizarReserva = async (req, res) => 
{

    // chequeos
    const [respuesta, formulario] = await logicInterface.CheckTokenPostForm(req.body);
    if (respuesta.isTokenValid === false) {
        console.error("token invalido");
        return res.send({ "isOk": false });
    }

    if (respuesta.isSchemaValid === false) {
        console.error("Esquema invalido");
        return res.send({ "isOk": false, "errorFormulario": "" });
    }
    
    // res.send({ isOk: true, numeroRegistro: "SDFSDFSDSF" });

    const resultadoInsercion = await logicInterface.ProcesarReserva(formulario);
    res.send({ isOk: resultadoInsercion.isInserted, numeroRegistro: resultadoInsercion.numeroRegistro });
    const resultadoEmailsEnviados = await logicInterface.EnviarCorreos(resultadoInsercion, formulario);
    await logicInterface.ConfirmacionEmailsEnviados(resultadoEmailsEnviados, resultadoInsercion.objectId);

};
