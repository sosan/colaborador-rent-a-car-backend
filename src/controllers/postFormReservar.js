const dbInterfaces = require("../database/dbInterfaces");
const { EnumMensajesErrores } = require("../errors/exceptions");
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


    

    console.log();

};

