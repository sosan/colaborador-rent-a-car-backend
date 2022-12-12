const dbInterfaces = require("../database/dbInterfaces");
const traducciones = require("../controllers/location");
const logic_postFormReservar = require("./logic_postFormReservar");
const logicPostFormIndex = require("./logic_postFormIndex");
const { ObjectId } = require('mongodb');

const EMAIL_ADMIN_RECIBIR_RESERVAS_1 = `${process.env.EMAIL_ADMIN_RECIBIR_RESERVAS_1}`;
const EMAIL_ADMIN_RECIBIR_RESERVAS_2 = `${process.env.EMAIL_ADMIN_RECIBIR_RESERVAS_2}`;

exports.PRECIO_SILLA_UNIDAD = 3;
exports.PRECIO_BOOSTER_UNIDAD = 3;


exports.SetPrecioSillaBooster = async (precios) =>
{

    this.PRECIO_SILLA_UNIDAD = precios["silla"];
    this.PRECIO_BOOSTER_UNIDAD = precios["booster"];

};


const htmlEmail = `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>
    <a href="0000">
        <img src="https://www.rentcarmallorca.es/img/Img-Logo/rentacar_logo_header.png">
    </a><br><br>
    XXXXXX
<br>
</body>

</html>
`;

let descripcionVehiculos = {};

exports.FillImagenesVehiculos = async (datosVehiculos) =>
{

    // let descripcionImagenes = {};
    for (let i = 0; i < datosVehiculos.length; i++)
    {
        const descripcionKey = datosVehiculos[i].descripcion;
        const imagen = `https://www.rentcarmallorca.es/img/Img-Vehiculos/${datosVehiculos[i].ImagenVehiclo}_Card.png`;
        descripcionVehiculos[descripcionKey] = imagen;
    }

};

exports.GetDescripcionVehiculos = async () =>
{
    return descripcionVehiculos;

};

exports.GetReservasNotSended = async (req, res) =>
{

    const resultado = await dbInterfaces.GetReservasNotSended();
    
    res.send({
        formdata: resultado
    });

};

exports.GetReservasSended = async (req, res) => {

    const resultado = await dbInterfaces.GetReservasSended();

    res.send({
        formdata: resultado
    });

};

exports.MostrarReservasPorFecha = async (req, res) =>
{

    const fechaInicioDate = new Date(req.body.fechaInicio);
    const fechaDestinoDate = new Date(req.body.fechaDestino);
    const confirmacionEnviada = req.body.enviadas;

    
    
    let resultado = undefined;

    if (confirmacionEnviada === true)
    {
        const fechaInicio = `${fechaInicioDate.getFullYear()}-${(fechaInicioDate.getMonth() + 1).toString().padStart(2, "00")}-${fechaInicioDate.getDate().toString().padStart(2, "00")}T00:00:00`;
        const fechaDestino = `${fechaDestinoDate.getFullYear()}-${(fechaDestinoDate.getMonth() + 1).toString().padStart(2, "00")}-${fechaDestinoDate.getDate().toString().padStart(2, "00")}T23:59:59`;

        // 
        resultado = await dbInterfaces.GetReservasConfirmacionEnviada(
            fechaInicio,
            fechaDestino, 
            confirmacionEnviada);

    }
    else
    {
        const fechaInicio = `${fechaInicioDate.getFullYear()}-${(fechaInicioDate.getMonth() + 1).toString().padStart(2, "00")}-${fechaInicioDate.getDate().toString().padStart(2, "00")}T00:00:00`;
        const fechaDestino = `${fechaDestinoDate.getFullYear()}-${(fechaDestinoDate.getMonth() + 1).toString().padStart(2, "00")}-${fechaDestinoDate.getDate().toString().padStart(2, "00")}T23:59:59`;

        resultado = await dbInterfaces.GetReservasConfirmacionNoEnviada(
            fechaInicio,
            fechaDestino,
            confirmacionEnviada);
    }
    
    
    res.send({
        formdata: resultado
    });

};

exports.DEBUG_PERMITIR_ENVIAR_CORREOS = false;

exports.ConfirmarReserva = async (req, res ) =>
{
    
    let formulario = req.body;
    // consultar si existe pago de la reserva

    let localizador = formulario.numeroRegistro;
    if (localizador === undefined)
    {
        localizador = formulario.localizador;
    }

    const resultadoEmailConfirmacionReserva = await logic_postFormReservar.ComprobarPagoReserva(localizador);

    if (resultadoEmailConfirmacionReserva === false && this.DEBUG_PERMITIR_ENVIAR_CORREOS === false) {
        return res.send({ "isOk": false });
    }

    const traduccion = await traducciones.ObtenerTraduccionEmailUsuario(formulario.idioma);

    if (formulario.dias === undefined)
    {
        const fechaRecogidaTemp = await logicPostFormIndex. ConversionTextoAFecha(formulario.fechaRecogida);
        const fechaDevolucionTemp = await logicPostFormIndex.ConversionTextoAFecha(formulario.fechaDevolucion);

        formulario["dias"] = await logicPostFormIndex.CalcularDiasEntrePivotes(fechaRecogidaTemp, fechaDevolucionTemp);
    }

    let precio_sillas_ninos = ((formulario.numero_sillas_nino - 0) * (formulario.dias - 0) * this.PRECIO_SILLA_UNIDAD).toFixed(2);
    let precio_booster_ninos = ((formulario.numero_booster - 0) * (formulario.dias - 0) * this.PRECIO_BOOSTER_UNIDAD).toFixed(2);
    let total_suplmento_tipo_conductor = (formulario.conductor_joven - 0).toFixed(2);
    let pago_online = (formulario.pago_online - 0).toFixed(2);


    if (formulario.pagoRecogida === undefined)
    {
        formulario["pagoRecogida"] = formulario.pago_recogida;
    }
    let pago_recogida = (formulario.pagoRecogida - 0).toFixed(2);
    let pago_alquiler = ((pago_online - 0) + (pago_recogida - 0)).toFixed(2);
    
    if (formulario.alquiler === undefined)
    {
        formulario["alquiler"] = formulario.pago_alquiler;
    }
    precioBase = (formulario.alquiler - 0).toFixed(2);
    
    [
        precio_sillas_ninos,
        precio_booster_ninos,
        total_suplmento_tipo_conductor,
        pago_online,
        pago_recogida,
        pago_alquiler,
        precioBase
    ] = await logic_postFormReservar.SanitizarPrecioDecimales(
            precio_sillas_ninos,
            precio_booster_ninos,
            total_suplmento_tipo_conductor,
            pago_online,
            pago_recogida,
            pago_alquiler,
            precioBase
        );

    
    let email = traduccion["reserva_confirmacion"]
        .replace(new RegExp("{A1}", "g"), formulario.nombre)
        .replace(new RegExp("{D1}", "g"), formulario.descripcion_vehiculo)
        .replace(new RegExp("{E1}", "g"), formulario.fechaRecogida)
        .replace(new RegExp("{E3}", "g"), formulario.horaRecogida)
        .replace(new RegExp("{F1}", "g"), formulario.fechaDevolucion)
        .replace(new RegExp("{E4}", "g"), formulario.horaDevolucion)
        .replace(new RegExp("{G1}", "g"), localizador)
        .replace(new RegExp("{Y1}", "g"), precioBase)
        .replace(new RegExp("{D6}", "g"), pago_online)
        .replace(new RegExp("{D7}", "g"), pago_recogida)
        .replace(new RegExp("{D8}", "g"), pago_alquiler)
        .replace(new RegExp("{Z3}", "g"), `<img src="${descripcionVehiculos[formulario.descripcion_vehiculo]}">` )
        .replace(new RegExp("{Z4}", "g"), `<a href="https://www.google.com/maps/place/Cam%C3%AD+de+Can+Pastilla,+51,+07610+Can+Pastilla,+Illes+Balears/@39.538882,2.71428,15z/data=!4m5!3m4!1s0x1297941e14ebb901:0x269d00f6b5ad9230!8m2!3d39.5388821!4d2.7142801?hl=es"><img src="https://www.rentcarmallorca.es/img/imagenlocalizacion.webp" width="200"></a>`)
        .replace(new RegExp("{C1}", "g"), "RentCarMallorca.es")
        .replace(new RegExp("{H1}", "g"), "servicios@rentcarmallorca.es")
        .replace(new RegExp("{J1}", "g"), "Camino de Can Pastilla, 51")
        .replace(new RegExp("{K1}", "g"), "07610 Can Pastilla - Palma de Mallorca")
    ;


    const textoSillas = traduccion["remplazo_sillas"]
        .replace(new RegExp("{D2}", "g"), formulario.numero_sillas_nino)
        .replace(new RegExp("{D4}", "g"), precio_sillas_ninos);

    const textoBooster = traduccion["remplazo_booster"]
        .replace(new RegExp("{D3}", "g"), formulario.numero_booster)
        .replace(new RegExp("{D5}", "g"), precio_booster_ninos);
    const textoConductorJoven = traduccion["remplazo_conductor_joven"]
        .replace(new RegExp("{D9}", "g"), total_suplmento_tipo_conductor);

    if (total_suplmento_tipo_conductor !== "0") {
        email = email.replace(new RegExp("{R1}", "g"), textoConductorJoven);
    }

    if (precio_sillas_ninos !== "0") {
        email = email.replace(new RegExp("{R2}", "g"), textoSillas);

    }

    if (precio_booster_ninos !== "0") {
        email = email.replace(new RegExp("{R3}", "g"), textoBooster);
    }

    email = email.replace(new RegExp("{br}", "g"), "<br>")
        .replace(new RegExp("{R1}", "g"), "")
        .replace(new RegExp("{R2}", "g"), "")
        .replace(new RegExp("{R3}", "g"), "");


    const bodyConfirmacionEmail = htmlEmail
        .replace("0000", "https://www.rentcarmallorca.es/")
        .replace("XXXXXX", email)
        ;

    let bodyEmail =
    {
        from:
        {
            name: "RentCarMallorca.es Servicios",
            address: `${EMAIL_ADMIN_RECIBIR_RESERVAS_1}`
        },
        to: `${formulario.email}`,
        subject: `${traduccion.sureserva} ${localizador}`,
        html: `${bodyConfirmacionEmail}`,

    };

    const respuestaReservaConfirmacion = await logic_postFormReservar.EnviarCorreoAh(bodyEmail);

    //enviarlo a la db
    const currentDate = await ObtenerCurrentDate();

    respuestaReservaConfirmacion["fechaEnvioConfirmacionReserva"] = currentDate;
    respuestaReservaConfirmacion["emailConfirmacionReservaEnviado"] = respuestaReservaConfirmacion.datosEmailConfirmacionReserva.isSended;

    //buscar por id
    const isUpdated = await dbInterfaces.UpdateReservaWithString(respuestaReservaConfirmacion, formulario._id);
    
    if (isUpdated === true)
    {
        res.send({ "isOk": true, "fechaEnvioConfirmacionReserva": currentDate });

    }
    else
    {
        res.send({ "isOk": false });
        //TODO:
    }
    

    // let bodyAdmin =
    // {
    //     from:
    //     {
    //         name: "RentCarMallorca.es Servicios",
    //         address: `${EMAIL_ADMIN_RECIBIR_RESERVAS_1}`
    //     },
    //     to: [`${EMAIL_ADMIN_RECIBIR_RESERVAS_1}`, `${EMAIL_ADMIN_RECIBIR_RESERVAS_2}` ],
    //     subject: `Confirmacion de reserva enviado correctamente con ${formulario.localizador}`,
    //     html: `Email de confirmacion de reserva enviado correctamente ${formulario.email} con localizador ${formulario.localizador}`,

    // };

    // await logic_postFormReservar.EnviarCorreoAh(bodyAdmin);


};



exports.MostrarReservasErrores = async (req, res) =>
{

    resultado = await dbInterfaces.GetReservasErrores();

    return res.send({"datos": resultado});

};

const ObtenerCurrentDate = async () => {
    let date_ob = new Date();

    const dia = date_ob.getUTCDate().toString().padStart(2, "00");
    const mes = (date_ob.getUTCMonth() + 1).toString().padStart(2, "00");
    const anyo = date_ob.getUTCFullYear();

    const hora = date_ob.getUTCHours().toString().padStart(2, "00");
    const minutos = date_ob.getUTCMinutes().toString().padStart(2, "00");
    const segundos = date_ob.getUTCSeconds().toString().padStart(2, "00");

    const cadena = `${anyo}-${mes}-${dia}T${hora}:${minutos}:${segundos}`;

    return cadena;

};


exports.BorrarReserva = async (req, res) =>
{

    if (req.body.token !== process.env.TOKEN_BACKEND_TO_FRONTEND_SECRET)
    {
        console.log("no son iguales tokens");
        return;
    }

    const resultado = await dbInterfaces.InivisibleReserva(req.body._id);
    
    res.send({
        isOk: resultado
    });


};


exports.EnviarEmailUsuario = async (req, res) =>
{

    const _id = req.body._id;

    const reserva = await dbInterfaces.GetReservasById(_id);
    if (reserva.numeroRegistro === undefined)
    {
        return res.send({});
    }

    const resultadoEmailsEnviados = await logic_postFormReservar.EnviarCorreos(reserva, reserva);
    const isUpdated = await logic_postFormReservar.ConfirmacionEmailsEnviados(resultadoEmailsEnviados, ObjectId(_id));
    resultadoEmailsEnviados["isUpdated"] = isUpdated;
    res.send({ "resultadoEmailsEnviados": resultadoEmailsEnviados });

};

