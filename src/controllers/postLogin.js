const { EnumMensajesErrores } = require("../errors/exceptions");
const apiSchema = require("../schemas/apischema");
const fetch = require("node-fetch");

const URI_BACKEND = `${process.env.URL_BACKEND}:${process.env.PORT_BACKEND}/controlpanel/login`;


exports.postLogin = async (req, res) =>
{

    const keys = Object.keys(req.body);
    if ( keys.length > 3) return res.redirect(404, "/");

    if (req.body.username !== "") return res.redirect(404, "/");

    if (req.body.email !== "" ||  req.body.password !== "")
    {
    
        const responseRaw = await fetch(URI_BACKEND, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(req.body)
        });

        const datos = await responseRaw.json();


    }

};



