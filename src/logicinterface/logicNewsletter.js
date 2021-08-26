const dbInterface = require("../database/dbInterfaces");
const {transporter} = require("../logicinterface/logicSendEmail");
const EMAIL_ADMIN_RECIBIR_RESERVAS_1 = `${process.env.EMAIL_ADMIN_RECIBIR_RESERVAS_1}`;
const path = require("path");

exports.CheckEmail = async (email) => {
    const regex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm;

    let resultado = { "isValid": false };
    const m = regex.exec(email);
    
    if (m === null) 
    {
        return resultado;
    }

    resultado["isValid"] = true;
    resultado["existeEmail"] = false;

    //comprobar si existe el correo en la base de datos
    const countEmails = await dbInterface.CheckEmailNewsletter(email);
    if (countEmails > 0)
    {
        resultado["existeEmail"] = true;
    }

    return resultado;

};

exports.AñadirEmailNewsLetter = async (email) =>
{

    const result = await dbInterface.AddEmailNewsletter(email);
    return result;

};


exports.ContruirEmailUsuario = async (formulario, traduccion) => {


    // .replace("USUARIO", formulario.nombre)
    let bodyConfirmacionEmail = traduccion["registro_newsletter"]
        .replace(new RegExp("URL_IMAGEN", "g"), "cid:logo_rentcarmallorca")
        .replace(new RegExp("NOMBRE_MARCA", "g"), "RentcarMallorca")
        .replace(new RegExp("EMAIL_MARCA", "g"), "servicios@rentcarmallorca.es")
        .replace(new RegExp("DIRECCION_MARCA", "g"), "Camino de Can Pastilla, 51")
        .replace(new RegExp("DIRECCION_1_MARCA", "g"), "07610 Can Pastilla - Palma de Mallorca")
        ;

    let bodyEmail =
    {
        from:
        {
            name: "Servicios RentCarMallorca.es",
            address: `${EMAIL_ADMIN_RECIBIR_RESERVAS_1}`
        },
        to: `${formulario.email}`,
        subject: `${traduccion.suregistronewsletter}`,
        html: `${bodyConfirmacionEmail}`,
        attachments: [{
            filename: "logo.png",
            path: path.resolve(__dirname, "../img/logo.png"),
            cid: "logo_rentcarmallorca"
        }]
    };


    return bodyEmail;

};


exports.EnviarCorreoIo = async (data) => {

    let isSended = false;
    let incrementalCount = 1;
    let resultadoEnvioEmail =
    {
        "isSended": false,
        "messageId": 0,
        "cannotSend": false
    };

    while (isSended === false)
    {
        try
        {
            const responseRaw = await transporter.sendMail(data);
    
            if (responseRaw.messageId !== undefined) {
    
                isSended = true;
                resultadoEnvioEmail["isSended"] = true;
                resultadoEnvioEmail["messageId"] = responseRaw.messageId;
    
            }
            else {
                await sleep(5000 * incrementalCount);
                incrementalCount++;
            }
    
            if (incrementalCount >= 10) {
                resultadoEnvioEmail["cannotSend"] = true;
                break;
            }

        }
        catch (error)
        {
            console.log(`${incrementalCount} No posible enviar Correo=${data.to}`);
            // await sleep(5000 * incrementalCount);
            // incrementalCount++;
            resultadoEnvioEmail["cannotSend"] = true;
            return resultadoEnvioEmail;
        }
    }

    // console.log(JSON.stringify(resultadoEnvioEmail));
    return resultadoEnvioEmail;



};


exports.MarcarCorreoNewsletterCorrectoIncorrecto = async (correo, validez) =>
{

    await dbInterface.MarcarCorreoNewsletterCorrectoIncorrecto(correo, validez);

};

const sleep = async (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

};