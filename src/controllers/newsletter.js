const fetch = require("node-fetch");

const ENDPOINT_NEWSLETTER_BACKEND = `${process.env.URL_BACKEND}:${process.env.PORT_BACKEND}${process.env.ENDPOINT_NEWSLETTER_BACKEND}`;

exports.ProcesarEmail = async (req, res) => {

    if (req.body.email === undefined) {
        return res.status(404).send();
    }

    if (req.body.email === "") {
        return res.status(404).send();
    }

    const isValidEmail = await CheckEmail(req.body.email)
    
    res.send({ "isOk": isValidEmail });


};


const CheckEmail = async (value) => {
    const regex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm;

    const m = regex.exec(value);
    let isValid = false;
    if (m !== null) {
        isValid = true;
    }

    return isValid;

};