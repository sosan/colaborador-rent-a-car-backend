
var botonesEditar = document.getElementsByClassName("boton_editar_template");



for (let i = 0; i < botonesEditar.length; i++)
{

    botonesEditar[i].addEventListener("click", async (evento) =>
    {
        console.log("sdfsdf");

        const body = {
            "accion": botonesEditar[i].id
        };

        const responseRaw = await fetch(`/mostrartemplate`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(body)
        });

        const datos = await responseRaw.json();
        
        const relleno = document.getElementById("main");

        const borrarMain = document.getElementById("borrar_main");
        if (borrarMain) {
            borrarMain.remove();
        }

        const trozoHtml = document.createElement("div");
        trozoHtml.id = "borrar_main";
        trozoHtml.innerHTML = datos.html;

        relleno.appendChild(trozoHtml);

        await SetBotonesDetalleTemplate();

    });

}

var SetBotonesDetalleTemplate = async () =>
{

    var botonesDetalleTemplate = document.getElementsByClassName("boton");

    for (let i = 0; i < botonesDetalleTemplate.length; i++)
    {

        botonesDetalleTemplate[i].addEventListener("click", async (evento) =>
        {

            if (botonesDetalleTemplate[i].id === "atras")
            {
                await LogicBotonTemplates(false);
                return;
            }

            const body = {
                "nombreArchivo": document.getElementById("accion").value,
                "accion": botonesDetalleTemplate[i].id,
                "textarea": document.getElementById("textarea").value,
            };

            const responseRaw = await fetch(`/mostrardetalletemplate`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(body)
            });

            const datosRecividos = await responseRaw.json();
            const resultado = document.getElementById("resultado");

            resultado.innerHTML = datosRecividos.resultado.datos;

        });

    }


};

