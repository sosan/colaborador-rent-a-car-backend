

const botonConfirmaciones = document.getElementById("confirmaciones");
const botonConfirmacionesOnMain = document.getElementById("confirmacionesMain");
const botonTemplates = document.getElementById("templates");
const botonTraducciones = document.getElementById("traducciones");
const todosBotones = document.getElementsByClassName("navList__subheading");

const botonLogs = document.getElementById("logs");

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

botonConfirmacionesOnMain.addEventListener("click", async (evento) =>
{
    evento.preventDefault();
    await botonConfirmacionesPrincipal(evento);

});

botonConfirmaciones.addEventListener("click", async (evento) =>
{
    
    evento.preventDefault();
    await botonConfirmacionesPrincipal(evento);

});


const botonConfirmacionesPrincipal = async (evento) =>
{

    await borrarColorTodosBotones();

    botonConfirmaciones.classList.add("navList__subheading_clicked");

    const rawResponse = await fetch("/0_QJFs2NH9a_f_a_BQ_NTib_Y3O6Ik_DkWIiW_mFtZSI/dashboard/confirmaciones", {
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
    if (borrarScript) {
        borrarScript.remove();
    }

    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.id = "borrar_script_mostrar_reservas";
    script.type = 'text/javascript';
    script.src = '/0_QJFs2NH9a_f_a_BQ_NTib_Y3O6Ik_DkWIiW_mFtZSI/dashboard/js/mostrar_reservas.js';
    head.appendChild(script);


    toggleClass(sidenavEl, SIDENAV_ACTIVE_CLASS);

    const botonBusqueda = document.getElementById("botonBusqueda_noenviado");
    if (botonBusqueda) {
        botonBusqueda.addEventListener("click", async (evento) => {
            evento.preventDefault();

            let datosEnviar = {
                url: "/0_QJFs2NH9a_f_a_BQ_NTib_Y3O6Ik_DkWIiW_mFtZSI/dashboard/busquedareservasporfecha",
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


};

botonTemplates.addEventListener("click", async (evento) =>
{

    evento.preventDefault();

    await LogicBotonTemplates(true);

});


botonTraducciones.addEventListener("click", async (evento) => 
{
    evento.preventDefault();

    await borrarColorTodosBotones();

    botonTraducciones.classList.add("navList__subheading_clicked");

    const rawResponse = await fetch("/0_QJFs2NH9a_f_a_BQ_NTib_Y3O6Ik_DkWIiW_mFtZSI/dashboard/traducciones", {
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
    
    let borrarContenido = document.getElementById("borrarcontenido");
    if (borrarContenido)
    {
        borrarContenido.remove();
    }
    const trozoHtml = document.createElement("div");
    trozoHtml.id = "borrar_main";
    trozoHtml.innerHTML = datos.html;

    relleno.appendChild(trozoHtml);
    
    // borrarContenido = document.getElementById("borrarcontenido");

    await ClickGuardarTraducciones();

    

    // const scriptDataTable = document.createElement('input');
    // scriptDataTable.id = "dataTable";
    // scriptDataTable.type = "hidden";
    // scriptDataTable.value = `${JSON.stringify(datos.traducciones)}`;
    // borrarContenido.appendChild(scriptDataTable);

    // const scriptXspreadSheet = document.createElement('script');
    // scriptXspreadSheet.src = "/0_QJFs2NH9a_f_a_BQ_NTib_Y3O6Ik_DkWIiW_mFtZSI/dashboard/js/hojacalculo/xspreadsheet.js";
    // borrarContenido.appendChild(scriptXspreadSheet);

    // scriptXspreadSheet.addEventListener("load", () => {
        
    //     const loadData = document.createElement('script');
    //     loadData.src = '/0_QJFs2NH9a_f_a_BQ_NTib_Y3O6Ik_DkWIiW_mFtZSI/dashboard/js/hojacalculo/loaddata.js';
    //     borrarContenido.appendChild(loadData);
        
    //     var botonActualizarDataSheet = document.getElementById("actualizarTraduccion");
    //     botonActualizarDataSheet.addEventListener("click", async () =>
    //     {

    //         const rawResponse = await fetch("/0_QJFs2NH9a_f_a_BQ_NTib_Y3O6Ik_DkWIiW_mFtZSI/dashboard/actualizartraducciones", {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             credentials: "include",

    //         });

    //         const datos = await rawResponse.json();
    //         if (datos.isOk === true) {
    //             botonActualizarDataSheet.innerText = "Actualizado";
    //             botonActualizarDataSheet.classList.add("verde");

    //         }
    //         else {
    //             botonActualizarDataSheet.innerText = "FALLO!";
    //             botonActualizarDataSheet.classList.add("rojo");
    //         }


    //         setTimeout(() => {
    //             botonActualizarDataSheet.innerText = "Actualizar Traduccion Frontend";
    //             botonActualizarDataSheet.classList.remove("verde");
    //             botonActualizarDataSheet.classList.remove("rojo");
    //         }, 3000);

    //     });

    //     var botonGuardarDataSheet = document.getElementById("guardarTraduccion");
    //     botonGuardarDataSheet.addEventListener("click", async () => {
    
    //         const hojaCalculoDatos = await ReturnData();

    //         const rawResponse = await fetch("/0_QJFs2NH9a_f_a_BQ_NTib_Y3O6Ik_DkWIiW_mFtZSI/dashboard/guardartraducciones", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             credentials: "include",
    //             body: JSON.stringify(hojaCalculoDatos)

    //         });

    //         const datos = await rawResponse.json();
    //         if (datos.isOk === true)
    //         {
    //             botonGuardarDataSheet.innerText = "Guardado";
    //             botonGuardarDataSheet.classList.add("verde");

    //         }
    //         else
    //         {
    //             botonGuardarDataSheet.innerText = "FALLO!";
    //             botonGuardarDataSheet.classList.add("rojo");
    //         }


    //         setTimeout(() => {
    //             botonGuardarDataSheet.innerText = "Guardar";
    //             botonGuardarDataSheet.classList.remove("verde");
    //             botonGuardarDataSheet.classList.remove("rojo");
    //         }, 3000);
    
    //     });
    // });


    toggleClass(sidenavEl, SIDENAV_ACTIVE_CLASS);

});

const ClickGuardarTraducciones = async () =>
{

    var botonGuardar = document.getElementById("guardarTraduccion");
    
    botonGuardar.addEventListener("click", async () => {

        const textoTraduccionesRaw = document.getElementById("textotraducciones").value;
        const textoTraduccionesComas = textoTraduccionesRaw.replace(new RegExp("\t", "g"), ";");
        const envioDatos = 
        {
            "textoTraduccionesComas": textoTraduccionesComas
        }

        const rawResponse = await fetch("/0_QJFs2NH9a_f_a_BQ_NTib_Y3O6Ik_DkWIiW_mFtZSI/dashboard/guardartraducciones", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(envioDatos)

        });

        const datos = await rawResponse.json();
        if (datos.isOk === true) {
            botonGuardar.innerText = "Guardado";
            botonGuardar.classList.add("verde");

        }
        else {
            botonGuardar.innerText = "FALLO!";
            botonGuardar.classList.add("rojo");
        }


        setTimeout(() => {
            botonGuardar.innerText = "Guardar";
            botonGuardar.classList.remove("verde");
            botonGuardar.classList.remove("rojo");
        }, 3000);

    });


};

const LogicBotonTemplates = async (slideActualizar) =>
{


    await borrarColorTodosBotones();

    botonTemplates.classList.add("navList__subheading_clicked");


    const rawResponse = await fetch("/0_QJFs2NH9a_f_a_BQ_NTib_Y3O6Ik_DkWIiW_mFtZSI/dashboard/templates", {
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
    script.src = '/0_QJFs2NH9a_f_a_BQ_NTib_Y3O6Ik_DkWIiW_mFtZSI/dashboard/js/clicktemplates.js';
    head.appendChild(script);

    if (slideActualizar === true)
    {
        toggleClass(sidenavEl, SIDENAV_ACTIVE_CLASS);

    }


};


botonLogs.addEventListener("click", async (evento) =>
{
    evento.preventDefault();

    await borrarColorTodosBotones();

    botonTemplates.classList.add("navList__subheading_clicked");


    const rawResponse = await fetch("/0_QJFs2NH9a_f_a_BQ_NTib_Y3O6Ik_DkWIiW_mFtZSI/dashboard/logs", {
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


    toggleClass(sidenavEl, SIDENAV_ACTIVE_CLASS);

});