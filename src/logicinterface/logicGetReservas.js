const dbInterfaces = require("../database/dbInterfaces");
const traducciones = require("../controllers/location");
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
        <img src="http://www.rentcarmallorca.es:8080/img/Img-Logo/rentacar_logo_header.png">
    </a><br><br>
    XXXXXX
<br>
</body>

</html>
`;



const descripcionVehiculos = {
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

exports.GetReservas = async (req, res) =>
{

    const resultado = await dbInterfaces.GetReservas();
    
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
        .replace(new RegExp("{Z3}", "g"), `<img src="${descripcionVehiculos[formulario.descripcion_vehiculo]}">` )
        .replace(new RegExp("{Z4}", "g"), `<a href="https://www.google.com/maps/place/Cam%C3%AD+de+Can+Pastilla,+51,+07610+Can+Pastilla,+Illes+Balears/@39.538882,2.71428,15z/data=!4m5!3m4!1s0x1297941e14ebb901:0x269d00f6b5ad9230!8m2!3d39.5388821!4d2.7142801?hl=es"><img src="http://www.rentcarmallorca.es:8080/img/imagenlocalizacion.webp" width="200"></a>`)
        .replace(new RegExp("{C1}", "g"), "RentCarMallorca.es")
        .replace(new RegExp("{H1}", "g"), "servicios@rentcarmallorca.es")
        .replace(new RegExp("{J1}", "g"), "Camino de Can Pastilla, 51")
        .replace(new RegExp("{K1}", "g"), "07610 Can Pastilla - Palma de Mallorca")
    ;

    
    const bodyConfirmacionEmail = htmlEmail
        .replace("0000", "http://www.rentcarmallorca.es:8080/")
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

    const responseRaw = await transporter.sendMail(bodyEmail);



};