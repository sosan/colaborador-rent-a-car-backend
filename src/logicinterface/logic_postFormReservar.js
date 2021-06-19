const Joi = require("joi");
const dbInterfaces = require("../database/dbInterfaces");
const logicStats = require("../logicinterface/logic_stats");
const traducciones = require("../controllers/location");
const fetch = require("node-fetch");

const URI_EMAIL_ADMIN_API_BACKEND = `${process.env.URI_EMAIL_ADMIN_API_BACKEND}`;
const EMAIL_ADMIN_TOKEN_API = `${process.env.EMAIL_ADMIN_TOKEN_API}`;

const URI_EMAIL_USER_API_BACKEND = `${process.env.URI_EMAIL_USER_API_BACKEND}`;
const EMAIL_USER_TOKEN_API = `${process.env.EMAIL_USER_TOKEN_API}`;

const EMAIL_ADMIN_RECIBIR_RESERVAS_1 = `${process.env.EMAIL_ADMIN_RECIBIR_RESERVAS_1}`;
const EMAIL_ADMIN_RECIBIR_RESERVAS_2 = `${process.env.EMAIL_ADMIN_RECIBIR_RESERVAS_2}`;

// TODO: generar string a partir del secreto
const GenerateTokenBackendToFrontend = async () => {

    return process.env.TOKEN_BACKEND_TO_FRONTEND_SECRET;
};


exports.EnviarCorreos = async (resultadoInsercion, formulario) =>
{

    const traduccion = await traducciones.ObtenerTraduccionEmailUsuario(formulario.idioma);

    if (traduccion === undefined) return;

    let bodyEmail = await ContruirEmailUsuario(resultadoInsercion, formulario, traduccion);

    let data = {
        method: "POST",
        headers: {
            "api_key": `${EMAIL_USER_TOKEN_API}`,
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: bodyEmail
    };

    // envio correo usuario
    const isUserEmailSended = await EnviarCorreo(URI_EMAIL_USER_API_BACKEND, data);

// -------------

    // envio correo administracion
    bodyEmail = await ConstruirEmailAdmins(resultadoInsercion, formulario);

    data = {
        method: "POST",
        headers: {
            "api_key": `${EMAIL_ADMIN_TOKEN_API}`,
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: bodyEmail
    };

    //envio correo admins
    const isAdminEmailSended = await EnviarCorreo(URI_EMAIL_ADMIN_API_BACKEND, data);
    
    const emailsEnviados = {
        "isUserEmailSended": isUserEmailSended,
        "isAdminEmailSended": isAdminEmailSended
    };

    return emailsEnviados;

};

exports.ConfirmacionEmailsEnviados = async (emailsEnviados, objectId) =>
{

    const currentDate = await ObtenerCurrentDate();

    emailsEnviados["fechaEmailsActualizado"] = currentDate;

    //buscar el id y actualizar el id
    const resultado = await dbInterfaces.UpdateReserva(emailsEnviados, objectId);
    console.log(`emails enviados:\n-> Usuarios: ${emailsEnviados.isUserEmailSended}\n-> Admins: ${emailsEnviados.isAdminEmailSended}` )
    


};


const ContruirEmailUsuario = async (resultadoInsercion, formulario, traduccion) =>
{

    bodyConfirmacionEmail = traduccion["email_confimacion"]
        .replaceAll("USUARIO", formulario.nombre)
        .replaceAll("NOMBRE_MARCA", "RentcarMallorca")
        .replaceAll("NOMBRE_COCHE", formulario.descripcion_vehiculo)
        .replaceAll("FECHA_INICIO", formulario.fechaRecogida)
        .replaceAll("HORA_INICIO", formulario.horaRecogida)
        .replaceAll("FECHA_FIN", formulario.fechaDevolucion)
        .replaceAll("HORA_FIN", formulario.horaDevolucion)
        .replaceAll("NUMERO_RESERVA", resultadoInsercion.numeroReserva)
        .replaceAll("TELEFONO_MARCA", "9999999")
        .replaceAll("EMAIL_MARCA", "cambiar@cambiar.com")
        .replaceAll("DIRECCION_MARCA", "Camino de Can Pastilla, 51")
        .replaceAll("DIRECCION_1_MARCA", "07610 Can Pastilla - Palma de Mallorca")

    ;

    // formulario.idioma

    // TODO: traducirlo a otros idiomas
    let bodyEmail = JSON.stringify({
        "from": {
            "email": "confirmation@pepisandbox.com",
            "name": `RentacarMallorca Email`
        },
        "subject": `${traduccion.sureserva} ${resultadoInsercion.numeroReserva}`,
        "content": [
            {
                "type": "html",
                "value": `${bodyConfirmacionEmail}`
            }
        ],
        "personalizations": [
            {
                "to": [
                    {
                        "email": `${formulario.email}`,
                        // "name": `${formulario.nombre}`
                    }
                ]
            }
        ]
    });

    return bodyEmail;

};

const ConstruirEmailAdmins = async (resultadoInsercion, formulario) =>
{

    let tabla = "";

    for (const key in formulario)
    {
        if (key === "token" || key === "useragent" || key === "location") continue;
        
        tabla += `
        <tr>
            <th>${key}</th>
            <th>${formulario[key]}</th>
        </tr>`;

    }

    let errorEmailSended = "";
    let subject = `Reserva Numero: ${resultadoInsercion.numeroReserva}`;
    if (formulario.isUserEmailSended === false) {
        // mostrar error en el correo
        errorEmailSended = `ATENCION!!!! Ha habido un error al enviar correo al usuario ${formulario.email}`;
        subject = `Error! Reserva Numero: ${resultadoInsercion.numeroReserva}`;

    }

    let html = 
`
<!DOCTYPE html>
<html>
<head>
<style>
#customers {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

#customers td, #customers th {
  border: 1px solid #ddd;
  padding: 8px;
}

#customers tr:nth-child(even){background-color: #f2f2f2;}

#customers tr:hover {background-color: #ddd;}

#customers th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #04AA6D;
  color: white;
}

a
{
    color: black;
}

</style>
</head>
<body>
${errorEmailSended}
Ha llegado una reserva nueva con el numero ${resultadoInsercion.numeroReserva} con los siguientes datos
<br>
<table id="customers">
  ${tabla}
</table>
</body>
</html>
`

    let bodyEmail = JSON.stringify({
        "from": {
            "email": "confirmation@pepisandbox.com",
            "name": "RentacarMallorca Confirmation"
        },
        "subject": `${subject}`,
        "content": [
            {
                "type": "html",
                "value": `${html}`
            }
        ],
        "personalizations": [
            {
                "to": [
                    {
                        "email": `${EMAIL_ADMIN_RECIBIR_RESERVAS_1}`,
                        // "name": "Confimacion Reservas"
                    },
                    // {
                    //     "email": `${EMAIL_ADMIN_RECIBIR_RESERVAS_2}`,
                    //     // "name": "Confimacion Reservas"
                    // }
                ]
            }
        ]
    });

    return bodyEmail;

};


const EnviarCorreo = async (uri, data) =>
{

    let isSended = false;
    let incrementalCount = 1;
    
    while (isSended === false)
    {
        const responseRaw = await fetch(uri, data);

        const emailIsSended = await responseRaw.json();
        if (emailIsSended.status === "success") {
            isSended = true;
        }
        else {
            await sleep(5000 * incrementalCount);
            incrementalCount++;
        }

        if (incrementalCount >= 10)
        {
            isSended = false;
            break;
        }
    }
    
    return isSended;

};




//2020-01-07T11:28:03.588+00:00
const ObtenerCurrentDate = async () =>
{
    let date_ob = new Date();

    const dia = date_ob.getUTCDate().toString().padStart(2, "00");
    const mes = (date_ob.getUTCMonth() + 1).toString().padStart(2, "00");
    const anyo = date_ob.getUTCFullYear();

    const hora = date_ob.getUTCHours().toString().padStart(2, "00");
    const minutos = date_ob.getUTCMinutes().toString().padStart(2, "00");
    const segundos = date_ob.getUTCSeconds().toString().padStart(2, "00");;
    const ms = date_ob.getUTCMilliseconds().toString().padStart(2, "00");

    const cadena = `${anyo}-${mes}-${dia}T${hora}:${minutos}:${segundos}:${ms}`;

    return cadena;

};


const ObtenerNumeroReserva = async () =>
{

    let date_ob = new Date();
    const dia = date_ob.getDate().toString().padStart(2, "00");
    const mes = (date_ob.getMonth() + 1).toString().padStart(2, "00");
    const anyo = date_ob.getFullYear();

    const cadenaComprobarDia = `${anyo}:${mes}:${dia}`;
    const cantidadReservasDia = await dbInterfaces.ConsultarCantidadReservasDia(cadenaComprobarDia);

    const numeroReserva = `${anyo}-${mes}-${dia}--${cantidadReservasDia}`;

    return numeroReserva;

};

exports.ProcesarReserva = async (formulario, currentDate) =>
{

    const numeroReserva = await ObtenerNumeroReserva();
    
    formulario["numeroReserva"] = numeroReserva;
    
    // formulario = await SanitizarFormulario(formulario);

    let isInserted = false;
    let incrementalCount = 1;
    while (isInserted === false)
    {
        result = await dbInterfaces.ProcesarReserva(formulario);
        isInserted = result.isInserted;
        if (isInserted === false)
        {
            await sleep(5000 * incrementalCount);
            incrementalCount++;
        }
    }
    return { "isInserted": isInserted, "objectId": result.objectId, "numeroReserva": numeroReserva};

};


const SanitizarFormulario = async (formulario) =>
{

    //quitar mayusculas, espacios, o caracteres no permitidos

};

const sleep = async (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

};


exports.CheckTokenPostForm = async (formulario) => {

    const schema = Joi.object({
        token: Joi.string().required(),
        useragent: Joi.object().required(),
        descripcion_vehiculo: Joi.string().required(),
        fechaRecogida: Joi.string().required(),
        horaRecogida: Joi.string().required(),
        fechaDevolucion: Joi.string().required(),
        horaDevolucion: Joi.string().required(),
        dias: Joi.number().required(),
        alquiler: Joi.number().required(),
        total_suplmento_tipo_conductor: Joi.number().required(),
        pagoRecogida: Joi.number().required(),
        pago_online: Joi.number().required(),
        titulo: Joi.string().required(),
        child_seat: Joi.number().required(),
        booster_seat: Joi.number().required(),
        conductor_con_experiencia: Joi.string().required(),
        email: Joi.string().required(),
        nombre: Joi.string().required(),
        apellidos: Joi.string().required(),
        telefono: Joi.string().required(),
        idioma: Joi.string().required(),
        

    });

    const [respuesta, formularioChecked] = await CheckTokenControlSchema(formulario, schema);

    return [respuesta, formularioChecked];

};

const CheckTokenControlSchema = async (formulario, schema) => {

    let respuesta = {};

    const isTokenValid = await CheckToken(formulario.token, dbInterfaces.tokenFromFrontend);
    respuesta["isTokenValid"] = isTokenValid;

    if (isTokenValid === false) {
        return [respuesta, formulario];
    }

    // TODO: generar string a partir del secreto
    formulario["token"] = await GenerateTokenBackendToFrontend();
    if (formulario.conductor_con_experiencia === undefined) {
        formulario["conductor_con_experiencia"] = "off";
    }

    const currentDate = await ObtenerCurrentDate();
    formulario["fechaAlta"] = currentDate;

    respuesta["isSchemaValid"] = await ControlSchema(formulario, schema);

    return [respuesta, formulario];

};


const CheckToken = async (token, tokenFromFrontend) => {

    let isValid = false;

    if (token === tokenFromFrontend) {
        isValid = true;
    }

    return isValid;
};

const ControlSchema = async (body, schema) => {

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

};



exports.SumarVisitaVehiculo = async (vehiculo) =>
{

    const resultado = await dbInterfaces.SumarVisitaVehiculo(vehiculo);
    return resultado;

};


exports.AñadirEstadisticas = async (formulario) =>
{

    const resultado = await logicStats.AñadirEstadisticas(formulario);
    
};



exports.ActualizarEstadisticas = async (formulario) => {

    const resultado = await logicStats.ActualizarEstadisticas(formulario);


    // const resultado = await logicStats.ActualizarEstadisticas(formulario);



};
