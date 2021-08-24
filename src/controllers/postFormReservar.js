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

    console.log("antes merchante params=" + req.body.Ds_MerchantParameters);
    const decodedMerchantParameters = await logicInterface.RecibeCodedMerchantParameters(req.body.Ds_MerchantParameters);
    console.log("decodedMerchantParrameters" + JSON.stringify(decodedMerchantParameters));

    // // DS_MERCHANT_ORDER
    /*
    {
        "Ds_Date":"24/08/2021",
        "Ds_Hour":"23:03",
        "Ds_SecurePayment":"1",
        "Ds_Card_Country":"724",
        "Ds_Amount":"13440",
        "Ds_Currency":"978",
        "Ds_Order":"MVT20210824",
        "Ds_MerchantCode":"352969752",
        "Ds_Terminal":"001",
        "Ds_Response":"0000",
        "Ds_MerchantData":"",
        "Ds_TransactionType":"0",
        "Ds_ConsumerLanguage":"1",
        "Ds_AuthorisationCode":"216449",
        "Ds_Card_Brand":"1",
        "Ds_ProcessedPayMethod":"5"
    }
    
    */

    const responseTransaction = decodedMerchantParameters.Ds_Response - 0;

    // transaccion realizada correctamente
    if (responseTransaction >= 0 && responseTransaction <= 99)
    {

        // buscar y modificar la reserva, enviar los correos
        decodedMerchantParameters.Ds_Order;
    }
    else
    {
        // trasaccion no realizada correctamente
    }
    
    
    res.send({"ok": "test"});



};


exports.TestMerchantParameters = async (req, res) =>
{

    res.send("TestMerchantParameters");

};
