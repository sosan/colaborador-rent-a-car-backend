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


    const bodyEmail = await ContruirEmailUsuario(resultadoInsercion, formulario, traducciones.ObtenerTraducciones());

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
    await EnviarCorreo(URI_EMAIL_USER_API_BACKEND, data);

    const tablaDatos = await ConstruirTablaDatos(formulario);
    // envio correo administracion
    bodyEmail = JSON.stringify({
        "from": {
            "email": "confirmation@pepisandbox.com",
            "name": "Reserva Rentacar confirmation"
        },
        "subject": `Reserva Numero: ${resultadoInsercion.numeroReserva} `,
        "content": [
            {
                "type": "html",
                "value": `<!DOCTYPE html>
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
</style>
</head>
<body>
Ha llegado una reserva nueva con el numero ${resultadoInsercion.numeroReserva} con los siguientes datos
<br>
${tablaDatos}
</body>
</html>`
            }
        ],
        "personalizations": [
            {
                "to": [
                    {
                        "email": `${EMAIL_ADMIN_RECIBIR_RESERVAS_1}`,
                        "name": "Confimacion Reservas"
                    },
                    {
                        "email": `${EMAIL_ADMIN_RECIBIR_RESERVAS_2}`,
                        "name": "Confimacion Reservas"
                    }
                ]
            }
        ]
    });

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
    await EnviarCorreo(URI_EMAIL_ADMIN_API_BACKEND, data);


};


const ContruirEmailUsuario = async(resultadoInsercion, formulario, locations) =>
{

    formulario.idioma

    // TODO: traducirlo a otros idiomas
    let bodyEmail = JSON.stringify({
        "from": {
            "email": "confirmation@pepisandbox.com",
            "name": "Reserva Rentacar confirmation"
        },
        "subject": `RentaCarMallorca Su Reserva Numero: ${resultadoInsercion.numeroReserva} `,
        "content": [
            {
                "type": "html",
                "value": `Hola ${formulario.nombre} Su Reserva Numero: ${resultadoInsercion.numeroReserva}....`
            }
        ],
        "personalizations": [
            {
                "to": [
                    {
                        "email": `${formulario.email}`,
                        "name": `${formulario.nombre}`
                    }
                ]
            }
        ]
    });

    return bodyEmail;

};

const ConstruirTablaDatos = async (formulario) =>
{

    let tabla = `<table>`
    
`<table id="customers">
  <tr>
    <th>Campos</th>
    <th>Datos</th>
  </tr>
  <tr>
    <td>Alfreds Futterkiste</td>
    <td>Maria Anders</td>

  </tr>
  <tr>
    <td>Berglunds snabbköp</td>
    <td>Christina Berglund</td>

  </tr>
  <tr>
    <td>Centro comercial Moctezuma</td>
    <td>Francisco Chang</td>

  </tr>
  <tr>
    <td>Ernst Handel</td>
    <td>Roland Mendel</td>

  </tr>
  <tr>
    <td>Island Trading</td>
    <td>Helen Bennett</td>

  </tr>
  <tr>
    <td>Königlich Essen</td>
    <td>Philip Cramer</td>

  </tr>
  <tr>
    <td>Laughing Bacchus Winecellars</td>
    <td>Yoshi Tannamuri</td>

  </tr>
  <tr>
    <td>Magazzini Alimentari Riuniti</td>
    <td>Giovanni Rovelli</td>

  </tr>
  <tr>
    <td>North/South</td>
    <td>Simon Crowther</td>

  </tr>
  <tr>
    <td>Paris spécialités</td>
    <td>Marie Bertrand</td>

  </tr>
</table>
`


};


const EnviarCorreo = async (uri, data) =>
{

    let isSended = false;
    let incrementalCount = 1;

    while (isSended === false) {
        const responseRaw = await fetch(uri, data);

        const emailIsSended = await responseRaw.json();
        if (emailIsSended.status === "success") {
            isSended = true;
        }
        else {
            await sleep(5000 * incrementalCount);
            incrementalCount++;
        }

    }

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

exports.ProcesarReserva = async (formulario) =>
{

    const numeroReserva = await ObtenerNumeroReserva();

    formulario["numeroReserva"] = numeroReserva;

    let isInserted = false;
    let incrementalCount = 1;
    while (isInserted === false)
    {
        isInserted = await dbInterfaces.ProcesarReserva(formulario);
        if (isInserted === false)
        {
            await sleep(5000 * incrementalCount);
            incrementalCount++;
        }
    }
    return { "isInserted": isInserted, "numeroReserva": numeroReserva};

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
        return respuesta;
    }

    // TODO: generar string a partir del secreto
    formulario["token"] = await GenerateTokenBackendToFrontend();
    if (formulario.conductor_con_experiencia === undefined) {
        formulario["conductor_con_experiencia"] = "off";
    }

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



// exports.CheckToken = async (res, req, tokenFromFrontend) =>
// {

//     let isValid = false;

//     if (req.useragent.browser === "node-fetch") 
//     {
//         isValid = true;
//     }
//     else
//     {
//         isValid = false;
//     }

//     if (req.body.token === tokenFromFrontend) {
//         isValid = true;
//     }
//     else
//     {
//         isValid = false;
//     }

//     return isValid;

// };





// exports.ControlSchema = async (body) => {

//     const schema = Joi.object({
//         "conductor_con_experiencia": Joi.string().required(),
//         "fase": Joi.number().required(),
//         "location": Joi.object().required(),
//         "success": Joi.string().required(),
//         "token": Joi.string().required(),
//         "useragent": Joi.object().required(),
//         "vehiculo": Joi.string().required()
//     });

//     const options = {
//         abortEarly: false,
//         allowUnknown: false,
//         stripUnknown: false
//     };
//     const validation = schema.validate(body, options);
//     let isValid = false;

//     if (validation.error === undefined) {
//         isValid = true;
//     }

//     return isValid;

// }



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
