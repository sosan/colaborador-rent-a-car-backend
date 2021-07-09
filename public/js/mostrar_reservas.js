const botonAtras = document.getElementById("botonAtras");
const botonEnviados = document.getElementById("botonEnviados");
const botonNoEnviados = document.getElementById("botonNoEnviados");
const botonOtros = document.getElementById("botonOtros");

const pestanyasContenido = document.getElementsByClassName("pestanyaContenido");
const pestanyasBotones = document.getElementsByClassName("boton");
const formularios = document.getElementsByClassName("formulario");


botonAtras.addEventListener("click", () => {
    console.log("sdfsdf");
});
botonNoEnviados.addEventListener("click", (evento) => { abrirPestanyas(evento, "noenviados"); } );
botonEnviados.addEventListener("click", (evento) => { abrirPestanyas(evento, "enviados"); } );
botonOtros.addEventListener("click", (evento) => { abrirPestanyas(evento, "otros"); });



const abrirPestanyas = (evento, pestanyaId) => 
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
    evento.currentTarget.classList.add("boton-rojo");
};




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