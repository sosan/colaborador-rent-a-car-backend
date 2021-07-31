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

    const hojaCalculoRaw = req.body;
    
    let hojaCalculoJson = await GenerateHeaders(hojaCalculoRaw[0].cells);

    for (let key in hojaCalculoRaw)
    {

        let currentFila = hojaCalculoRaw[key].cells;
        for (let keyCurrentFila in currentFila)
        {
            switch(keyCurrentFila)
            {
                case "1": 
                    hojaCalculoJson["en"][hojaCalculoRaw[key].cells[0].text] = hojaCalculoRaw[key].cells[keyCurrentFila].text;
                
                break;
                case "2":
                    hojaCalculoJson["es"][hojaCalculoRaw[key].cells[0].text] = hojaCalculoRaw[key].cells[keyCurrentFila].text;

                break;
                case "3":
                    hojaCalculoJson["it"][hojaCalculoRaw[key].cells[0].text] = hojaCalculoRaw[key].cells[keyCurrentFila].text;
                break;
                case "4":
                    hojaCalculoJson["de"][hojaCalculoRaw[key].cells[0].text] = hojaCalculoRaw[key].cells[keyCurrentFila].text;
                break;
            }
        }
    
    }

    // const traduccionAnterior = await dbInterfaces.GetTranslations();
    // const borrar = await dbInterfaces.BorrarTraduccionAnterior("locations_copia");
    // const resultadoTraduccionAnterior = await dbInterfaces.InsertarTraduccion(traduccionAnterior, "locations_copia");
    // const resultado = await dbInterfaces.ActualizarTraduccion(hojaCalculoJson, "locations");

    // // actualizar la variable 
    // const actualizacion = await controllerLocation.Backend_TO_Frontend();
    
    // res.send({
    //     "isOk": resultado,
    //     "actualizcion": actualizacion,
    // });
    
    const resultadoCommit = await logicGithub.GuardarTraduccion(hojaCalculoJson, "sosan", "Colaborador-rent-a-car-backend");

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
        // hojaCalculoJson[keyForJson] = { "position_header": key };
        hojaCalculoJson[keyForJson] = {  };
    }

    return hojaCalculoJson;
};