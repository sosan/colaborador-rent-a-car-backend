const dbInterfaces = require("../database/dbInterfacesControlPanel");
const controllerLocation = require("../controllers/location");
const logicGithub = require("./logicGithub");


exports.MostrarTraducciones = async (req, res ) =>
{
    const resultado = await dbInterfaces.GetTranslations();

    res.send({
        "traducciones": resultado,
    });

};

exports.GuardarTraducciones = async (req, res) =>
{

    const traduccionNueva = req.body;
    const traduccionActual = await dbInterfaces.GetTranslations();
    const resultadoBorradoTraduccionAnterior = await dbInterfaces.BorrarTraduccionAnterior("locations_copia");
    const resultadoInsercionTraduccionAnterior = await dbInterfaces.InsertarTraduccion(traduccionActual, "locations_copia");
    const resultado = await dbInterfaces.ActualizarTraduccion(traduccionNueva, "locations");

    // actualizar la variable 
    const actualizacion = await controllerLocation.Backend_TO_Frontend();
    
    res.send({
        "isOk": resultado,
        "actualizacion": actualizacion,
    });
    
    const resultadoCommit = await logicGithub.GuardarTraduccion(
        traduccionNueva,
        process.env.USUARIO_AUTO_GIT,
        process.env.USUARIO_AUTO_NOMBRE_REPO
    );

};


exports.ActualizarTraducciones = async (req, res) =>
{
    // actualizar la variable 
    const resultado = await controllerLocation.Backend_TO_Frontend();

    res.send({
        "isOk": resultado,
    });

}


const GenerateHeaders = async (headersList) =>
{
    let hojaCalculoJson = {};
    for (let key in headersList)
    {

        if (headersList[key].text === "idioma_web") continue;

        const keyForJson = headersList[key].text;
        hojaCalculoJson[keyForJson] = {  };
    }

    return hojaCalculoJson;
};