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

    // const hojaCalculoRaw = req.body;
    
    // let hojaCalculoJson = await GenerateHeaders(hojaCalculoRaw[0].cells);

    // for (let key in hojaCalculoRaw)
    // {

    //     let currentFila = hojaCalculoRaw[key].cells;
    //     for (let keyCurrentFila in currentFila)
    //     {
    //         switch(keyCurrentFila)
    //         {
    //             case "1": 
    //                 hojaCalculoJson["en"][hojaCalculoRaw[key].cells[0].text] = hojaCalculoRaw[key].cells[keyCurrentFila].text;
                
    //             break;
    //             case "2":
    //                 hojaCalculoJson["es"][hojaCalculoRaw[key].cells[0].text] = hojaCalculoRaw[key].cells[keyCurrentFila].text;

    //             break;
    //             case "3":
    //                 hojaCalculoJson["it"][hojaCalculoRaw[key].cells[0].text] = hojaCalculoRaw[key].cells[keyCurrentFila].text;
    //             break;
    //             case "4":
    //                 hojaCalculoJson["de"][hojaCalculoRaw[key].cells[0].text] = hojaCalculoRaw[key].cells[keyCurrentFila].text;
    //             break;
    //         }
    //     }
    
    // }

    const traduccionActual = await dbInterfaces.GetTranslations();
    const resultadoBorradoTraduccionAnterior = await dbInterfaces.BorrarTraduccionAnterior("locations_copia");
    const resultadoInsercionTraduccionAnterior = await dbInterfaces.InsertarTraduccion(traduccionActual, "locations_copia");
    const resultado = await dbInterfaces.ActualizarTraduccion(traduccionNueva, "locations");

    // actualizar la variable 
    const actualizacion = await controllerLocation.Backend_TO_Frontend();
    
    res.send({
        "isOk": resultado,
        "actualizcion": actualizacion,
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