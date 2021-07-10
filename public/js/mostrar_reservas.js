const botonAtras = document.getElementById("botonAtras");
const botonEnviados = document.getElementById("botonEnviados");
const botonNoEnviados = document.getElementById("botonNoEnviados");
const botonOtros = document.getElementById("botonOtros");

const pestanyasContenido = document.getElementsByClassName("pestanyaContenido");
const pestanyasBotones = document.getElementsByClassName("boton");



botonAtras.addEventListener("click", () => {
    console.log("sdfsdf");
});

botonNoEnviados.addEventListener("click", async (evento) => 
{ 
    
    const datosDevueltos = await GetReservas("/reservasnoenviadas");

    const relleno = document.getElementById("noenviados");

    const borrarNoEnviados = document.getElementById("borrarnoenviados");
    if (borrarNoEnviados) {
        borrarNoEnviados.remove();
    }

    const trozoHtml = document.createElement("div");
    trozoHtml.id = "borrarnoenviados";
    trozoHtml.innerHTML = datosDevueltos.reservasEnviadas;

    relleno.appendChild(trozoHtml);
    abrirPestanyas(botonNoEnviados, "noenviados"); 

});


botonEnviados.addEventListener("click", async (evento) => 
{ 
    const datosDevueltos = await GetReservas("/reservasenviadas");

    const relleno = document.getElementById("enviados");

    const borrarEnviados = document.getElementById("borrarenviados");
    if (borrarEnviados) {
        borrarEnviados.remove();

    }

    const trozoHtml = document.createElement("div");
    trozoHtml.id = "borrarenviados";
    trozoHtml.innerHTML = datosDevueltos.reservasEnviadas;

    relleno.appendChild(trozoHtml);

    await AnadirEventosFormularios();

    abrirPestanyas(botonEnviados, "enviados"); 

});
botonOtros.addEventListener("click", async (evento) => { abrirPestanyas(botonOtros, "otros"); });


const GetReservas = async (url) =>
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


const abrirPestanyas = (nombreBoton, pestanyaId) => 
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

const AnadirEventosFormularios = async () =>
{

    const formularios = document.getElementsByClassName("formulario");
    for (let i = 0; i < formularios.length; i++)
    {
        formularios[i].addEventListener("submit", async (evento) =>
        {
    
            evento.preventDefault();
    
            const data = new FormData(formularios[i]);
            let body = Object.fromEntries(data);
    
            const responseRaw = await fetch("/enviocorreo", {
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

}

AnadirEventosFormularios();



const ObtenerCurrentDate = async (fecha) => {

    let date_ob = new Date(fecha);

    const dia = (date_ob.getDate()).toString().padStart(2, "00");
    const mes = (date_ob.getUTCMonth() + 1).toString().padStart(2, "00");
    const anyo = date_ob.getUTCFullYear();

    const minuto = date_ob.getMinutes().toString().padStart(2, "00");
    const horas = date_ob.getHours().toString().padStart(2, "00");
    const segundos = date_ob.getSeconds().toString().padStart(2, "00");

    // const textoDia = new Intl.DateTimeFormat("es").format(date_ob);

    const fechaActual = `${dia}-${mes}-${anyo} ${horas}:${minuto}:${segundos}`;

    return fechaActual;

};