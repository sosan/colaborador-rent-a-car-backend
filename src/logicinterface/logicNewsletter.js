const dbInterface = require("../database/dbInterfaces");


exports.CheckEmail = async (email) => {
    const regex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm;

    let resultado = { "isValid": false };
    const m = regex.exec(email);
    
    if (m === null) 
    {
        return resultado;
    }

    resultado["isValid"] = true;
    resultado["existeEmail"] = false;

    //comprobar si existe el correo en la base de datos
    const countEmails = await dbInterface.CheckEmailNewsletter(email);
    if (countEmails > 0)
    {
        resultado["existeEmail"] = true;
    }

    return resultado;

};

exports.AñadirEmailNewsLetter = async (email) =>
{

    const result = await dbInterface.AddEmailNewsletter(email);
    return result;

};