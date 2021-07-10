const fetch = require("node-fetch");
const eta = require("eta");


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

    res.render("mostrar_reservas", {
        noenviados: datos.formdata
    });

};

exports.MostrarReservasEnviadas = async (req, res) => {

    const response = await fetch(`http://${process.env.URL_BACKEND}:3000/reservas_enviadas`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    })

    const datos = await response.json();
    const html = eta.render(templateConfirmacionEnviada, { enviados: datos.formdata })

    res.send({
        reservasEnviadas: html
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
    const html = eta.render(templateConfirmacionNoEnviada, { noenviados: datos.formdata })
    // let result = await eta.renderAsync(
    res.send({
        reservasEnviadas: html
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

const templateConfirmacionNoEnviada = `
<% const FechasES=(fecha)=> { 
    fecha = fecha.substring(0, fecha.length - 4);
    fecha += "Z";
    let date_ob=new Date(fecha);
    
    const dia=(date_ob.getDate()).toString().padStart(2, "00" );
    const mes=(date_ob.getMonth() + 1).toString().padStart(2, "00" ); 
    const anyo=date_ob.getFullYear(); 
    const minuto=date_ob.getMinutes().toString().padStart(2, "00" ); 
    const horas=date_ob.getHours().toString().padStart(2, "00" ); 
    const segundos=date_ob.getSeconds().toString().padStart(2, "00" ); 
    
    const fechaActual=dia + "-" + mes+ "-" +anyo+ " " +horas+ ":" +minuto+ ":" +segundos;
    return fechaActual; } %>


<ul>
                <li class="centrado">
                    <div class="tamanyo-200">
                        Localizador
                    </div>
                    <div class="tamanyo-200">
                        Nombre Apellidos
                    </div>
                    <div class="tamanyo-200">
                        Correo
                    </div>
                    <div class="tamanyo-200">
                        Fecha Alta
                    </div>
                    <div class="tamanyo-200">
                        Fecha Envio
                    </div>
                    <div class="tamanyo-201">
                        Boton
                    </div>
                </li>

                <% for (let i=0; i < it.noenviados.length; i++) { %>

                    <li class="centrado">
                        <div class="tamanyo-200">
                            <b>
                                <%=it.noenviados[i].numeroRegistro %>
                            </b>
                        </div>
                        <div class="tamanyo-200">
                            <%=it.noenviados[i].nombre %>
                                <%=it.noenviados[i].apellidos %>
                        </div>
                        <div class="tamanyo-200">
                            <%=it.noenviados[i].email %>
                        </div>
                        <div class="tamanyo-200">
                        
                            <% const alta=FechasES(it.noenviados[i].fechaAlta) %>
                            <%= alta %>
                        </div>

                        <div class="tamanyo-200">
                            <% if (it.noenviados[i].fechaEnvioConfirmacionReserva) { %>
                                <% const fe = FechasES(it.noenviados[i].fechaEnvioConfirmacionReserva) %>
                                <%= fe %>
                            <% } else { %>
                                --
                            <% } %>
                        </div>
                        <div class="tamanyo-201">
                            <form class="formulario" action="/enviocorreo" method="post">
                                <input type="hidden" name="_id" value="<%=it.noenviados[i]._id %>">
                                <input type="hidden" name="localizador" value="<%=it.noenviados[i].numeroRegistro %>">
                                <input type="hidden" name="nombre" value="<%=it.noenviados[i].nombre %>">
                                <input type="hidden" name="email" value="<%=it.noenviados[i].email %>">
                                <input type="hidden" name="idioma" value="<%=it.noenviados[i].idioma %>">
                                <input type="hidden" name="fechaRecogida" value="<%=it.noenviados[i].fechaRecogida %>">
                                <input type="hidden" name="horaRecogida" value="<%=it.noenviados[i].horaRecogida %>">
                                <input type="hidden" name="fechaDevolucion"
                                    value="<%=it.noenviados[i].fechaDevolucion %>">
                                <input type="hidden" name="horaDevolucion"
                                    value="<%=it.noenviados[i].horaDevolucion %>">
                                <input type="hidden" name="numero_sillas_nino"
                                    value="<%=it.noenviados[i].numero_sillas_nino %>">
                                <input type="hidden" name="numero_booster"
                                    value="<%=it.noenviados[i].numero_booster %>">
                                <input type="hidden" name="descripcion_vehiculo"
                                    value="<%=it.noenviados[i].descripcion_vehiculo %>">

                                <button id="botonEnviar" class="centrado-boton_correo azul" type="submit">
                                    Enviar correo
                                </button>
                            </form>
                        </div>
                    </li>
                    <% } %>

            </ul>`;


const templateConfirmacionEnviada = ` 
<% const FechasES=(fecha)=> {

    
    fecha = fecha.split(".")[0];
    fecha += "Z";
    let date_ob=new Date(fecha);

    const dia=(date_ob.getDate()).toString().padStart(2, "00" );
    const mes=(date_ob.getMonth() + 1).toString().padStart(2, "00" );
    const anyo=date_ob.getFullYear();
    const minuto=date_ob.getMinutes().toString().padStart(2, "00" );
    const horas=date_ob.getHours().toString().padStart(2, "00" );
    const segundos=date_ob.getSeconds().toString().padStart(2, "00" );

    const fechaActual=dia + "-" + mes+ "-" +anyo+ " " +horas+ ":" +minuto+ ":" +segundos;
    return fechaActual; } %>


<ul>
                <li class="centrado">
                    <div class="tamanyo-200">
                        Localizador
                    </div>
                    <div class="tamanyo-200">
                        Nombre Apellidos
                    </div>
                    <div class="tamanyo-200">
                        Correo
                    </div>

                    <div class="tamanyo-200">
                        Fecha Envio
                    </div>
                    <div class="tamanyo-201">
                        Boton
                    </div>
                </li>

                <% for (let i=0; i < it.enviados.length; i++) { %>

                    <li class="centrado">
                        <div class="tamanyo-200">
                            <b>
                                <%=it.enviados[i].numeroRegistro %>
                            </b>
                        </div>
                        <div class="tamanyo-200">
                            <%=it.enviados[i].nombre %>
                                <%=it.enviados[i].apellidos %>
                        </div>
                        <div class="tamanyo-200">
                            <%=it.enviados[i].email %>
                        </div>

                        <div class="tamanyo-200">
                            <% if (it.enviados[i].fechaEnvioConfirmacionReserva) { %>
                                <% const fe = FechasES(it.enviados[i].fechaEnvioConfirmacionReserva) %>
                                <%= fe %>
                            <% } else { %>
                                --
                            <% } %>
                        </div>
                        <div class="tamanyo-201">
                            <form class="formulario" action="/enviocorreo" method="post">
                                <input type="hidden" name="_id" value="<%=it.enviados[i]._id %>">
                                <input type="hidden" name="localizador" value="<%=it.enviados[i].numeroRegistro %>">
                                <input type="hidden" name="nombre" value="<%=it.enviados[i].nombre %>">
                                <input type="hidden" name="email" value="<%=it.enviados[i].email %>">
                                <input type="hidden" name="idioma" value="<%=it.enviados[i].idioma %>">
                                <input type="hidden" name="fechaRecogida" value="<%=it.enviados[i].fechaRecogida %>">
                                <input type="hidden" name="horaRecogida" value="<%=it.enviados[i].horaRecogida %>">
                                <input type="hidden" name="fechaDevolucion"
                                    value="<%=it.enviados[i].fechaDevolucion %>">
                                <input type="hidden" name="horaDevolucion"
                                    value="<%=it.enviados[i].horaDevolucion %>">
                                <input type="hidden" name="numero_sillas_nino"
                                    value="<%=it.enviados[i].numero_sillas_nino %>">
                                <input type="hidden" name="numero_booster"
                                    value="<%=it.enviados[i].numero_booster %>">
                                <input type="hidden" name="descripcion_vehiculo"
                                    value="<%=it.enviados[i].descripcion_vehiculo %>">

                                <button id="botonEnviar" class="centrado-boton_correo verde" type="submit" disabled>
                                    Enviado
                                </button>
                            </form>
                        </div>
                    </li>
                    <% } %>

            </ul>`;
