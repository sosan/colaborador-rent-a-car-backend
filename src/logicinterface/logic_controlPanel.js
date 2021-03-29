const dbInterfaces = require("../database/dbInterfacesControlPanel");


exports.CheckUserPassword = async (email, password) =>
{

    const resultado = await dbInterfaces.CheckUserPassword(email, password);
    if (resultado.resultados.length === 1)
    {
        return true;
    }
    else
    {
        return false;
    }
    

};