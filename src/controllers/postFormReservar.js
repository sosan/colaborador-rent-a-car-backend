
const dbInterfaces = require("../database/dbInterfaces");
const { EnumMensajesErrores } = require("../errors/exceptions");
const logicInterface = require("../logicinterface/logic_postFormReservar");
const fetch = require("node-fetch");

const URI_EMAIL_API_BACKEND = `${process.env.URI_EMAIL_API_BACKEND}`;
const EMAIL_TOKEN_API = `${process.env.EMAIL_TOKEN_API}`;


exports.postRealizarReserva = async (req, res) => 
{

    // chequeos
    const [respuesta, formulario] = await logicInterface.CheckTokenPostForm(req.body);
    if (respuesta.isTokenValid === false) {
        console.error("token invalido");
        return res.send({ "isOk": false });
    }

    if (respuesta.isSchemaValid === false) {
        console.error("Esquema invalido");
        return res.send({ "isOk": false, "errorFormulario": "" });
    }

    const resultadoInsercion = await logicInterface.ProcesarReserva(formulario);
    
    //TODO: generar token

    res.send({ isOk: resultadoInsercion.isInserted, numeroReserva: resultadoInsercion.numeroReserva });



    let body = JSON.stringify({
        "from": {
            "email": "confirmation@pepisandbox.com",
            "name": "Reserva Rentacar confirmation"
        },
        "subject": `Reserva Numero: ${resultadoInsercion.numeroReserva} `,
        "content": [
            {
                "type": "html",
                "value": "Hello Lionel, Your flight for Barcelona is confirmed."
            }
        ],
        "personalizations": [
            {
                "to": [
                    {
                        "email": `${process.env.EMAIL_RECIBIR_RESERVAS_1}`,
                        "name": "Confimacion Reservas"
                    },
                    {
                        "email": `${process.env.EMAIL_RECIBIR_RESERVAS_2}`,
                        "name": "Confimacion Reservas"
                    }
                ]
            }
        ]
    });


    let isSended = false;
    let incrementalCount = 1;

    while (isSended === false)
    {
        const responseRaw = await fetch(URI_EMAIL_API_BACKEND, {
            method: "POST",
            headers: {
                "api_key": `${EMAIL_TOKEN_API}`,
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: body
        });

        const emailIsSended = await responseRaw.json();
        if (emailIsSended.status === "success")
        {
            isSended = true;
        }
        else
        {
            await sleep(5000 * incrementalCount);
            incrementalCount++;
        }

    }


};

