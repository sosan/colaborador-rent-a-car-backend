const dbInterfaces = require("../database/dbInterfacesControlPanel");


exports.CheckAdminUserPassword = async (email, password) =>
{

    const resultado = await dbInterfaces.CheckAdminUserPassword(email, password);
    if (resultado.resultados.length === 1)
    {
        return true;
    }
    else
    {
        return false;
    }
    

};


exports.CheckEmailUsernamePassword = async (username, email, password) => {

    let isOk = true;

    if (username !== "") {
        isOk = false;
    }

    if (email === "" || password === "") {
        isOk = false;
    }

    return isOk;

};
