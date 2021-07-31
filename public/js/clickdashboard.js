const botonConfirmaciones = document.getElementById("confirmaciones");
const botonTemplates = document.getElementById("templates");
const todosBotones = document.getElementsByClassName("navList__subheading");

const sidenavEl = document.getElementById('sidenav');
const gridEl = document.getElementById('grid');
const SIDENAV_ACTIVE_CLASS = 'sidenav--active';


const toggleClass = (el, className) =>
{
    if (el.classList.contains(className) === true) {
        el.classList.remove(className);
    } else {
        el.classList.add(className);
    }
};


document.getElementById('header__menu').addEventListener('click', function (e) {
    
    toggleClass(sidenavEl, SIDENAV_ACTIVE_CLASS);
});

document.getElementById('sidenav__brand-close').addEventListener('click', function (e) {
    
    toggleClass(sidenavEl, SIDENAV_ACTIVE_CLASS);

});




const borrarColorTodosBotones = async () =>
{

    for (let i = 0; i < todosBotones.length; i++)
    {
        todosBotones[i].classList.remove("navList__subheading_clicked");
    }

};


botonConfirmaciones.addEventListener("click", async (evento) =>
{

    evento.preventDefault();

    await borrarColorTodosBotones();
    
    botonConfirmaciones.classList.add("navList__subheading_clicked");
    
    const rawResponse = await fetch("/confirmaciones", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    });
    
    const datos = await rawResponse.json();
    
    const relleno = document.getElementById("main");
    
    const borrarMain = document.getElementById("borrar_main");
    if (borrarMain) {
        borrarMain.remove();
    }
    
    const trozoHtml = document.createElement("div");
    trozoHtml.id = "borrar_main";
    trozoHtml.innerHTML = datos.html;
    
    relleno.appendChild(trozoHtml);
    
    const fechaInicio = document.getElementById("fechaInicioBusquedaNoEnviada");
    const fechaDestino = document.getElementById("fechaDestinoBusquedaNoEnviada");

    const destino = new Date();
    fechaDestino.value = destino.getFullYear().toString() + '-' + (destino.getMonth() + 1).toString().padStart(2, 0) + '-' + destino.getDate().toString().padStart(2, 0);;

    destino.setDate(destino.getDate() - 30);
    fechaInicio.value = destino.getFullYear().toString() + '-' + (destino.getMonth() + 1).toString().padStart(2, 0) + '-' + destino.getDate().toString().padStart(2, 0);

    const borrarScript = document.getElementById("borrar_script_mostrar_reservas");
    if (borrarScript)
    {
        borrarScript.remove();
    }

    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.id = "borrar_script_mostrar_reservas";
    script.type = 'text/javascript';
    script.src = '../js/mostrar_reservas.js';
    head.appendChild(script);

    botonBusqueda = document.getElementById("botonBusqueda_noenviado");
    if (botonBusqueda) 
    {
        botonBusqueda.addEventListener("click", async (evento) => {
            evento.preventDefault();

            let datosEnviar = {
                url: "/busquedareservasporfecha",
                relleno: "noenviados",
                idBorrar: "borrarnoenviados",
                botonBusqueda: "botonBusqueda_noenviado",
                botonPestanya: "botonNoEnviados",
                formFechaInicio: "fechaInicioBusquedaNoEnviada",
                formFechaDestino: "fechaDestinoBusquedaNoEnviada",
                enviadas: false,
                method: "post"
            };

            await RecibirDatos(datosEnviar);
            return;

        });

    }
    
    toggleClass(sidenavEl, SIDENAV_ACTIVE_CLASS);

});


botonTemplates.addEventListener("click", async (evento) =>
{

    evento.preventDefault();

    console.log("clicked");

    await borrarColorTodosBotones();

    botonTemplates.classList.add("navList__subheading_clicked");


    const rawResponse = await fetch("/templates", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    });

    const datos = await rawResponse.json();

    const relleno = document.getElementById("main");

    const borrarMain = document.getElementById("borrar_main");
    if (borrarMain) {
        borrarMain.remove();
    }

    const trozoHtml = document.createElement("div");
    trozoHtml.id = "borrar_main";
    trozoHtml.innerHTML = datos.html;

    relleno.appendChild(trozoHtml);

    const borrarScript = document.getElementById("borrar_script_mostrar_templates");
    if (borrarScript) {
        borrarScript.remove();
    }
    
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.id = "borrar_script_mostrar_templates";
    script.type = 'text/javascript';
    script.src = '../js/clicktemplates.js';
    head.appendChild(script);

    toggleClass(sidenavEl, SIDENAV_ACTIVE_CLASS);



});