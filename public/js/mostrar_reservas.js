var botonEnviados = document.getElementById("botonEnviados");
var botonNoEnviados = document.getElementById("botonNoEnviados");
var botonOtros = document.getElementById("botonOtros");

var pestanyasContenido = document.getElementsByClassName("pestanyaContenido");
var pestanyasBotones = document.getElementsByClassName("boton");

var botonBusqueda = undefined;
var botonBusquedaNoEnviado = undefined;



botonNoEnviados.addEventListener("click", async (evento) => 
{
    evento.preventDefault();
    await RecibirDatos({
        url: "/0_QJFs2NH9a_f_a_BQ_NTib_Y3O6Ik_DkWIiW_mFtZSI/dashboard/reservasnoenviadas",
        relleno: "noenviados",
        idBorrar: "borrarnoenviados",
        botonBusqueda: "botonBusqueda_noenviado",
        botonPestanya: "botonNoEnviados",
        formFechaInicio: "fechaInicioBusquedaNoEnviada",
        formFechaDestino: "fechaDestinoBusquedaNoEnviada",
        enviadas: false,
        method: "get"
    });

    return;
    
    

});

var RecibirDatos = async (config) =>
{

    let datosDevueltos = undefined;
    if (config.method === "get")
    {
        datosDevueltos = await GetReservas(config.url);
    }
    else
    {

        const body = 
        {
            fechaInicio: document.getElementById(config.formFechaInicio).value,
            fechaDestino: document.getElementById(config.formFechaDestino).value,
            enviadas: config.enviadas
        };
        datosDevueltos = await PostSearchReservas(config.url, body);
    }

    const relleno = document.getElementById(config.relleno);
    const borrar = document.getElementById(config.idBorrar);
    if (borrar) {
        borrar.remove();
    
    }
    
    const trozoHtml = document.createElement("div");
    trozoHtml.id = config.idBorrar;
    trozoHtml.innerHTML = datosDevueltos.html;
    
    relleno.appendChild(trozoHtml);
    
    await AnadirEventosFormularios();

    if (datosDevueltos.calcularFecha === true)
    {
        const fechaInicio = document.getElementById(config.formFechaInicio);
        const fechaDestino = document.getElementById(config.formFechaDestino);
    
        const destino = new Date();
        fechaDestino.value = destino.getFullYear().toString() + '-' + (destino.getMonth() + 1).toString().padStart(2, 0) + '-' + destino.getDate().toString().padStart(2, 0);;
    
        destino.setDate(destino.getDate() - 30);
        fechaInicio.value = destino.getFullYear().toString() + '-' + (destino.getMonth() + 1).toString().padStart(2, 0) + '-' + destino.getDate().toString().padStart(2, 0);
    }

    
    botonBusqueda = document.getElementById(config.botonBusqueda);
    if (botonBusqueda)
    {
        botonBusqueda.addEventListener("click", async (evento) => 
        {
            evento.preventDefault();

            let datosEnviar = {
                url: "/0_QJFs2NH9a_f_a_BQ_NTib_Y3O6Ik_DkWIiW_mFtZSI/dashboard/busquedareservasporfecha",
                relleno: config.relleno,
                idBorrar: config.idBorrar,
                botonBusqueda: config.botonBusqueda,
                botonPestanya: config.botonPestanya,
                formFechaInicio: config.formFechaInicio,
                formFechaDestino: config.formFechaDestino,
                enviadas: config.enviadas,
                method: "post"
            };

            await RecibirDatos(datosEnviar);
            return;
        
        });

    }
    
    const botonPestanya = document.getElementById(config.botonPestanya);
    
    abrirPestanyas(botonPestanya, config.relleno);

};


botonEnviados.addEventListener("click", async (evento) => 
{ 
    evento.preventDefault();
    await RecibirDatos({
        url: "/0_QJFs2NH9a_f_a_BQ_NTib_Y3O6Ik_DkWIiW_mFtZSI/dashboard/reservasenviadas",
        relleno: "enviados",
        idBorrar: "borrarenviados",
        botonBusqueda: "botonBusqueda_enviado",
        botonPestanya: "botonEnviados",
        formFechaInicio: "fechaInicioBusquedaEnviada",
        formFechaDestino: "fechaDestinoBusquedaEnviada",
        enviadas: true,
        method: "get"
    });

});


botonOtros.addEventListener("click", async (evento) => { abrirPestanyas(botonOtros, "otros"); });
// botonOtros.addEventListener("click", async (evento) => {

//     evento.preventDefault();


//     const responseRaw = await fetch("/0_QJFs2NH9a_f_a_BQ_NTib_Y3O6Ik_DkWIiW_mFtZSI/dashboard/reservaserrores", {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         credentials: "include",
//     });

//     const datosDevueltos = await responseRaw.json();

    
    
//     abrirPestanyas(botonOtros, "otros"); 

// });


var GetReservas = async (url) =>
{

    const responseRaw = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    const datosDevueltos = await responseRaw.json();
    return datosDevueltos;

};

var PostSearchReservas = async (url, body) => {

    const responseRaw = await fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body)
    });

    const datosDevueltos = await responseRaw.json();
    return datosDevueltos;

};


var abrirPestanyas = (nombreBoton, pestanyaId) => 
{
    
    for (i = 0; i < pestanyasContenido.length; i++) 
    {
        pestanyasContenido[i].style.display = "none";
    }

    for (i = 0; i < pestanyasBotones.length; i++) 
    {
        pestanyasBotones[i].classList.remove("boton-rojo");
    }

    document.getElementById(pestanyaId).style.display = "block";
    nombreBoton.classList.add("boton-rojo");

};

var AnadirEventosFormularios = async () =>
{

    const formularios = document.getElementsByClassName("formulario");
    for (let i = 0; i < formularios.length; i++)
    {
        formularios[i].addEventListener("submit", async (evento) =>
        {
    
            evento.preventDefault();
    
            const data = new FormData(formularios[i]);
            let body = Object.fromEntries(data);
    
            const responseRaw = await fetch("/0_QJFs2NH9a_f_a_BQ_NTib_Y3O6Ik_DkWIiW_mFtZSI/dashboard/enviocorreo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(body)
            });
    
            const datosDevueltos = await responseRaw.json();
    
            if (datosDevueltos.isOk === true)
            {
                const boton = formularios[i].lastElementChild;
                boton.innerText = "Enviado";
                boton.classList.remove("azul");
                boton.classList.add("verde");
    
                const fecha = await ObtenerCurrentDate(datosDevueltos.fechaEnvioConfirmacionReserva);
    
                formularios[i].parentElement.previousElementSibling.innerText = fecha;
                formularios[i].lastElementChild.disabled = true;
            }
            else
            {
    
                const boton = formularios[i].lastElementChild;
                boton.innerText = "Error!";
                boton.classList.remove("azul");
                boton.classList.add("rojo");
    
                formularios[i].parentElement.previousElementSibling.innerText = "ERROR!";
    
            }
    
    
    
    
        });
    
    }


    var listadoBotonesMasDetalles = document.getElementsByClassName("botonMasDetalles");
    var botonesCerrar = document.getElementsByClassName("details-modal-close");

    for (let i = 0; i < listadoBotonesMasDetalles.length; i++) {

        const overlay = document.getElementById(`overlay-botonmasdetalles_${i}`);
        if (overlay === null) continue;

        overlay.addEventListener("click", async (evento) => {

            evento.preventDefault();
            const divOverlay = evento.target;

            if (divOverlay.classList.contains("modal-visible") === true) {
                divOverlay.classList.remove("modal-visible");
                divOverlay.classList.add("modal-invisible");
                document.body.style.overflow = null;

            }

        });

        listadoBotonesMasDetalles[i].addEventListener("click", async (evento) => {

            const divOverlay = document.getElementById(`overlay-botonmasdetalles_${i}`);
            if (divOverlay === undefined) return;
            divOverlay.addEventListener("click", async (evento) => {

                evento.preventDefault();
                const divOverlay = evento.target;

                if (divOverlay.classList.contains("modal-visible") === true) {
                    divOverlay.classList.remove("modal-visible");
                    divOverlay.classList.add("modal-invisible");
                    document.body.style.overflow = null;

                }

            });


            if (divOverlay.classList.contains("modal-invisible") === true) {
                document.body.style.overflow = "hidden";
                document.querySelector("html").scrollTop = window.scrollY;

                divOverlay.classList.remove("modal-invisible");
                divOverlay.classList.add("modal-visible");
            }
        });
    }

    for (let p = 0; p < botonesCerrar.length; p++) {
        botonesCerrar[p].addEventListener("click", (evento) => {

            evento.preventDefault();
            let divOverlay = document.getElementsByClassName("overlay-transparente");

            // let botonesCerrar = document.getElementsByClassName("details-modal-close");
            for (let o = 0; o < divOverlay.length; o++) {

                if (divOverlay[o].classList.contains("modal-visible") === true) {
                    divOverlay[o].classList.remove("modal-visible");
                    divOverlay[o].classList.add("modal-invisible");
                    document.body.style.overflow = null;

                }

            }

        });


    }


    var listadoBotonesBorrarReserva = document.getElementsByClassName("botonBorrarReserva");

    for (let i = 0; i < listadoBotonesBorrarReserva.length; i++) {
        listadoBotonesBorrarReserva[i].addEventListener("click", async (evento) => {
            const _id = document.getElementById(`_id_${i}`).value;

            const body = {
                "_id": _id
            };
            const resultado = await fetch("/0_QJFs2NH9a_f_a_BQ_NTib_Y3O6Ik_DkWIiW_mFtZSI/dashboard/borrarreserva",
                {

                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(body)

                });

            const datos = await resultado.json();

            let divOverlay = document.getElementsByClassName("overlay-transparente");

            for (let o = 0; o < divOverlay.length; o++) {

                if (divOverlay[o].classList.contains("modal-visible") === true) {
                    divOverlay[o].classList.remove("modal-visible");
                    divOverlay[o].classList.add("modal-invisible");
                    document.body.style.overflow = null;

                }

            }

            await RecibirDatos({
                url: "/0_QJFs2NH9a_f_a_BQ_NTib_Y3O6Ik_DkWIiW_mFtZSI/dashboard/reservasnoenviadas",
                relleno: "noenviados",
                idBorrar: "borrarnoenviados",
                botonBusqueda: "botonBusqueda_noenviado",
                botonPestanya: "botonNoEnviados",
                formFechaInicio: "fechaInicioBusquedaNoEnviada",
                formFechaDestino: "fechaDestinoBusquedaNoEnviada",
                enviadas: false,
                method: "get"
            });

            // listadoBotonesMasDetalles = document.getElementsByClassName("botonMasDetalles");
            // botonesCerrar = document.getElementsByClassName("details-modal-close");
            // listadoBotonesBorrarReserva = document.getElementsByClassName("botonBorrarReserva");

        });
    }


    var listadoBotonesEnviarEmailUsuario = document.getElementsByClassName("botonEnviarEmail");

    for (let i = 0; i < listadoBotonesEnviarEmailUsuario.length; i++)
    {

        listadoBotonesEnviarEmailUsuario[i].addEventListener("click", async (evento) =>
        {
            const _id = document.getElementById(`_id_usuario_email_${i}`).value;
            const body = {
                "_id": _id
            };
            const resultado = await fetch("/0_QJFs2NH9a_f_a_BQ_NTib_Y3O6Ik_DkWIiW_mFtZSI/dashboard/enviaremailusuario",
                {

                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(body)

                });

            const datos = await resultado.json();

            if (datos.resultadoEmailsEnviados.resultadoUserEmailSended.cannotSend === false 
                || datos.resultadoEmailsEnviados.resultadoAdminEmailSended.cannotSend === false
                || datos.resultadoEmailsEnviados.reservaContieneErrores === false
            )
            {
                listadoBotonesEnviarEmailUsuario[i].innerText = "ENVIADO";
            }
            else
            {
                listadoBotonesEnviarEmailUsuario[i].innerText = "ERROR";

            }
            
            setTimeout(() => {
                listadoBotonesEnviarEmailUsuario[i].innerText = "ENVIAR EMAIL DE COMPRA POR USUARIO";
            }, 3000);
            
        });

    }


}

AnadirEventosFormularios();



var ObtenerCurrentDate = async (fecha) => {

    let date_ob = new Date(fecha);
    
    const dia = (date_ob.getDate()).toString().padStart(2, "00");
    const mes = (date_ob.getUTCMonth() + 1).toString().padStart(2, "00");
    const anyo = date_ob.getUTCFullYear();
    
    const minuto = date_ob.getMinutes().toString().padStart(2, "00");
    const horas = date_ob.getUTCHours().toString().padStart(2, "00");
    const segundos = date_ob.getSeconds().toString().padStart(2, "00");
    
    // const textoDia = new Intl.DateTimeFormat("es").format(date_ob);
    
    const fechaActual = `${dia}-${mes}-${anyo} ${horas}:${minuto}:${segundos}`;
    
    return fechaActual;
    
};

