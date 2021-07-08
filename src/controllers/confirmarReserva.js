const fetch = require("node-fetch");


exports.MostrarReservas = async (req, res) =>
{

    const response = await fetch("http://localhost:3000/mostrar_reservas", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    })

    const datos = await response.json();

    res.render("mostrar_reservas", {
        formdata: datos.formdata
    });

};

exports.RedirigirEnvioCorreo = async (req, res) =>
{
    res.redirect("/confirmar");

};

exports.EnvioCorreo = async (req, res) =>
{


    const response = await fetch(`http://${process.env.URL_BACKEND}:3000/envioCorreoConfirmacionReserva`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(req.body)
    });

    const datos = await response.json();


};