const dbInterfaces = require("../database/dbInterfacesControlPanel");

exports.MostrarTraducciones = async (req, res ) =>
{

    const resultado = await dbInterfaces.GetTranslations();

    res.send({
        "traducciones": resultado,
    });


};