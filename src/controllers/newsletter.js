const news = require("../logicinterface/logicNewsletter");
const fetch = require("node-fetch");
const traducciones = require("../controllers/location");

const ENDPOINT_NEWSLETTER_BACKEND = `${process.env.URL_BACKEND}:${process.env.PORT_BACKEND}${process.env.ENDPOINT_NEWSLETTER_BACKEND}`;

exports.ProcesarEmail = async (req, res) => {

    if (req.body.email === undefined) {
        return res.status(404).send();
    }

    if (req.body.email === "") {
        return res.status(404).send();
    }

    const emailChecked = await news.CheckEmail(req.body.email);

    if (emailChecked.isValid === false)
    {
        return res.status(404).send();
    }
    
    if (emailChecked.existeEmail === true)
    {
        return res.send({ "isOk": false });
    }
    
    res.send({ "isOk": true });
    await news.AñadirEmailNewsLetter(req.body.email);

    const traduccion = await traducciones.ObtenerTraduccionEmailUsuario(req.body.idioma);

    if (traduccion === undefined)
    {
        return res.send({ "isOk": false });
    }

    let bodyEmail = await news.ContruirEmailUsuario(req.body, traduccion);

    const resultadoUserEmailSended = await news.EnviarCorreoIo(bodyEmail);


};

