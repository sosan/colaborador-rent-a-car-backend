const dbInterfaces = require("../database/dbInterfaces");
const traducciones = require("../controllers/location");
const logic_postFormReservar = require("./logic_postFormReservar");
const { transporter } = require("./logicSendEmail");

const EMAIL_ADMIN_RECIBIR_RESERVAS_1 = `${process.env.EMAIL_ADMIN_RECIBIR_RESERVAS_1}`;
const EMAIL_ADMIN_RECIBIR_RESERVAS_2 = `${process.env.EMAIL_ADMIN_RECIBIR_RESERVAS_2}`;


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



exports.descripcionVehiculos = {
    "Toyota Aygo": "http://rentcarmallorca.es:8080/img/Img-Vehiculos/toyotaAygoRed_Card.png",
    "Suzuky Burgman 125": "http://rentcarmallorca.es:8080/img/Img-Vehiculos/Suzuki-Burgman_125cc_Card.png",
    "Citröen C1 Open": "http://rentcarmallorca.es:8080/img/Img-Vehiculos/CitroenC1_open_Card.png",
    "Toyota Aygo Open": "http://rentcarmallorca.es:8080/img/Img-Vehiculos/toyotaAygoOpenWhite_Card.png",
    "Peugeot 108": "http://rentcarmallorca.es:8080/img/Img-Vehiculos/peugeot108Blue_Card.png",
    "Peugeot 807": "http://rentcarmallorca.es:8080/img/Img-Vehiculos/peugeot807Grey_Card.png",
    "Citröen C1": "http://rentcarmallorca.es:8080/img/Img-Vehiculos/citroenC1White_Card.png",
    "Piaggio Liberty 125": "http://rentcarmallorca.es:8080/img/Img-Vehiculos/PiaggioLiberty_125cc_Card.png",
    "Citröen C3": "http://rentcarmallorca.es:8080/img/Img-Vehiculos/citroenC3WhiteRed_Card.png",
    "Citröen C1 Auto": "http://rentcarmallorca.es:8080/img/Img-Vehiculos/citroenC1AutomaticPlata_Card.png",
    "Peugeot 208": "http://rentcarmallorca.es:8080/img/Img-Vehiculos/peugeot_208_Card.png"

}


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



exports.ConfirmarReserva = async (req, res ) =>
{

    const formulario = req.body;
    const traduccion = await traducciones.ObtenerTraduccionEmailUsuario(formulario.idioma);

    const email = traduccion["reserva_confirmacion"]
        .replace(new RegExp("{A1}", "g"), formulario.nombre)
        .replace(new RegExp("{D1}", "g"), formulario.descripcion_vehiculo)
        .replace(new RegExp("{E1}", "g"), formulario.fechaRecogida)
        .replace(new RegExp("{E3}", "g"), formulario.horaRecogida)
        .replace(new RegExp("{F1}", "g"), formulario.fechaDevolucion)
        .replace(new RegExp("{E4}", "g"), formulario.horaDevolucion)
        .replace(new RegExp("{G1}", "g"), formulario.localizador)
        .replace(new RegExp("{L1}", "g"), formulario.localizador)
        .replace(new RegExp("{D2}", "g"), formulario.numero_sillas_nino)
        .replace(new RegExp("{D3}", "g"), formulario.numero_booster)
        .replace(new RegExp("{Z3}", "g"), `<img src="${this.descripcionVehiculos[formulario.descripcion_vehiculo]}">` )
        .replace(new RegExp("{Z4}", "g"), `<a href="https://www.google.com/maps/place/Cam%C3%AD+de+Can+Pastilla,+51,+07610+Can+Pastilla,+Illes+Balears/@39.538882,2.71428,15z/data=!4m5!3m4!1s0x1297941e14ebb901:0x269d00f6b5ad9230!8m2!3d39.5388821!4d2.7142801?hl=es"><img src="https://www.rentcarmallorca.es/img/imagenlocalizacion.webp" width="200"></a>`)
        .replace(new RegExp("{C1}", "g"), "RentCarMallorca.es")
        .replace(new RegExp("{H1}", "g"), "servicios@rentcarmallorca.es")
        .replace(new RegExp("{J1}", "g"), "Camino de Can Pastilla, 51")
        .replace(new RegExp("{K1}", "g"), "07610 Can Pastilla - Palma de Mallorca")
    ;

    
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
        subject: `${traduccion.sureserva} ${formulario.localizador}`,
        html: `${bodyConfirmacionEmail}`,

    };

    const respuestaReservaConfirmacion = await logic_postFormReservar.EnviarCorreoAh(bodyEmail); //transporter.sendMail(bodyEmail);

    //enviarlo a la db
    const currentDate = await ObtenerCurrentDate(); //new Date().toISOString();

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
    

    let bodyAdmin =
    {
        from:
        {
            name: "RentCarMallorca.es Servicios",
            address: `${EMAIL_ADMIN_RECIBIR_RESERVAS_1}`
        },
        to: [`${EMAIL_ADMIN_RECIBIR_RESERVAS_1}`, `${EMAIL_ADMIN_RECIBIR_RESERVAS_2}` ],
        subject: `Confirmacion de reserva enviado correctamente con ${formulario.localizador}`,
        html: `Email de confirmacion de reserva enviado correctamente`,

    };

    await logic_postFormReservar.EnviarCorreoAh(bodyAdmin);


};

const ObtenerCurrentDate = async () => {
    let date_ob = new Date();

    const dia = date_ob.getUTCDate().toString().padStart(2, "00");
    const mes = (date_ob.getUTCMonth() + 1).toString().padStart(2, "00");
    const anyo = date_ob.getUTCFullYear();

    const hora = date_ob.getUTCHours().toString().padStart(2, "00");
    const minutos = date_ob.getUTCMinutes().toString().padStart(2, "00");
    const segundos = date_ob.getUTCSeconds().toString().padStart(2, "00");
    // const ms = date_ob.getUTCMilliseconds().toString().padStart(2, "00");

    const cadena = `${anyo}-${mes}-${dia}T${hora}:${minutos}:${segundos}`;

    return cadena;

};