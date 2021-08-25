const fetch = require("node-fetch");
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
    
    
    // res.send({ isOk: true, numeroRegistro: "TEMPORAL" });
    
    const resultadoInsercion = await logicInterface.ProcesarReserva(formulario);

    res.send({ 
        isOk: resultadoInsercion.isInserted,
        numeroRegistro: resultadoInsercion.numeroRegistro,
        merchantPayment: resultadoInsercion.merchantPayment
    });


    // const resultadoEmailsEnviados = await logicInterface.EnviarCorreos(resultadoInsercion, formulario);
    // await logicInterface.ConfirmacionEmailsEnviados(resultadoEmailsEnviados, resultadoInsercion.objectId);

};



exports.PeticionPago = async (req, res) => {

    const merchantPayment = await logicInterface.CreateMerchantPayment(
        req.body,
        process.env.MERCHANT_CODE,
        process.env.MERCHANT_KEY_CODED
    );

    //enviamos al backedn la informacion
    const responseRaw = await fetch("https://sis-t.redsys.es:25443/sis/rest/trataPeticionREST", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(merchantPayment)
    });

    const datos = await responseRaw.json();
    console.log("datos=" + datos);

};

exports.ProcesarMerchantParameters = async (req, res) =>
{

    // console.log("antes merchante params=" + req.body.Ds_MerchantParameters);
    const decodedMerchantParameters = await logicInterface.RecibeCodedMerchantParameters(req.body.Ds_MerchantParameters);
    // console.log("decodedMerchantParrameters" + JSON.stringify(decodedMerchantParameters));
    
    const responseTransaction = decodedMerchantParameters.Ds_Response - 0;

    // transaccion realizada correctamente
    // https://pagosonline.redsys.es/codigosRespuesta.html
    if (responseTransaction >= 0 && responseTransaction <= 99)
    {

        // buscar y modificar la reserva, enviar los correos
        
        const reserva = await logicInterface.BuscarReservaModificar(decodedMerchantParameters);
        // console.log("reserva total=" + JSON.stringify(reserva));
        const resultadoEmailsEnviados = await logicInterface.EnviarCorreos(reserva, reserva);
        await logicInterface.ConfirmacionEmailsEnviados(resultadoEmailsEnviados, reserva._id);
        res.send({ "resultadoEmailsEnviados": resultadoEmailsEnviados });
    }
    else
    {
        // trasaccion no realizada correctamente
    }
    

};

