const fetch = require("node-fetch");
const eta = require("eta");
const path = require("path");


exports.MostrarConfirmaciones = async (req, res) =>
{

    const response = await fetch(`http://${process.env.URL_BACKEND}:3000/reservas_noenviadas`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    })

    const datos = await response.json();

    const html = await eta.renderFileAsync(path.join(__dirname, '../../public/mostrar_reservas_layout.html'), { noenviados: datos.formdata })

    res.send({
        html: html,
        calcularFecha: true,
    });

    // const html = await eta.renderFileAsync(path.join(__dirname, "../../public/templateConfirmacionNoEnviada.html"), { noenviados: datos.formdata });
    // res.send({
    //     reservasEnviadas: html
    // });
    


};

exports.MostrarReservas = async (req, res) =>
{

    const response = await fetch(`http://${process.env.URL_BACKEND}:3000/reservas_noenviadas`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    })

    const datos = await response.json();

    res.render(path.join(__dirname, '../../public/mostrar_reservas.html'), {
        noenviados: datos.formdata,
        calcularFecha: true,
    });

};

exports.MostrarReservasErrores = async (req, res) =>
{

    const response = await fetch(`http://${process.env.URL_BACKEND}:3000/reservaserrores`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    });

    const datos = await response.json();

    res.render(path.join(__dirname, '../../public/mostrar_reservas_errores.html'), {
        reservaerrores: datos.resultados,
        calcularFecha: true,
    });

};

exports.EnviarEmailUsuario = async (req, res) =>
{

    const _body = req.body;

    const response = await fetch(`http://${process.env.URL_BACKEND}:3000/enviaremailusuario`,
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(_body)
    }
    );

    const data = await response.json();
    res.send({"resultadoEmailsEnviados": data.resultadoEmailsEnviados})


};

exports.MostrarReservasEnviadas = async (req, res) => {


    //TODO: recibir las ultimas 10 reservas?
    const response = await fetch(`http://${process.env.URL_BACKEND}:3000/reservas_enviadas`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    });



    const datos = await response.json();
    // const html = await eta.renderFileAsync(templateConfirmacionEnviada, { enviados: datos.formdata });
    const html = await eta.renderFileAsync(path.join(__dirname, "../../public/templateConfirmacionEnviada.html"), { enviados: datos.formdata });

    res.send({
        html: html,
        calcularFecha: true,
    });

};

exports.MostrarReservasNoEnviadas = async (req, res) => {

    const response = await fetch(`http://${process.env.URL_BACKEND}:3000/reservas_noenviadas`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    })

    const datos = await response.json();
    const html = await eta.renderFileAsync(path.join(__dirname, "../../public/templateConfirmacionNoEnviada.html"), { noenviados: datos.formdata });
    // const html = eta.render(templateConfirmacionNoEnviada, { noenviados: datos.formdata })
    // let result = await eta.renderAsync(
    res.send({
        html: html,
        calcularFecha: true,
    });

};

exports.MostrarReservasPorFecha = async (req, res) =>
{
    
    const response = await fetch(`http://${process.env.URL_BACKEND}:3000/busquedareservasfecha`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(req.body)
    })

    const datos = await response.json();
    let html = undefined;
    if (req.body.enviadas === true)
    {
        html = await eta.renderFileAsync(path.join(__dirname, "../../public/templateConfirmacionEnviada.html"), 
        { 
            enviados: datos.formdata, 
            fecha: true,
            fechaInicio: req.body.fechaInicio,
            fechaDestino: req.body.fechaDestino
        
        });
    }
    else
    {
        html = await eta.renderFileAsync(path.join(__dirname, "../../public/templateConfirmacionNoEnviada.html"), 
        { 
            noenviados: datos.formdata, 
            fecha: true,
            fechaInicio: req.body.fechaInicio,
            fechaDestino: req.body.fechaDestino
        
        });
    }
    res.send({
        html: html,
        calcularFecha: false,
        fechaInicio: req.body.fechaInicio,
        fechaDestino: req.body.fechaDestino
    });






};

exports.BorrarReserva = async (req, res) =>
{
    console.log("borrar reserva");
    const body = {
        "token": process.env.TOKEN_BACKEND_TO_FRONTEND_SECRET,
        ...req.body
    }

    const response = await fetch(`http://${process.env.URL_BACKEND}:3000/borrarreserva`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body)
    })

    const datos = await response.json();

    if (datos.isOk === false)
    {
        console.log(`fallo de cambio en reserva=${req.body._id}`);
    }

    // this.MostrarReservasNoEnviadas(req, res);

    res.send({
        "isOk": datos.isOk
    });

};


exports.RedirigirEnvioCorreo = async (req, res) =>
{
    res.redirect("/0_QJFs2NH9a_f_a_BQ_NTib_Y3O6Ik_DkWIiW_mFtZSI/dashboard/confirmar");

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

    if (datos.isOk === true)
    {
        res.send({ "isOk": true, "fechaEnvioConfirmacionReserva": datos.fechaEnvioConfirmacionReserva });

    }
    else
    {
        res.send({ "isOk": false });
        // realizar comprobaciones....
    }


};


