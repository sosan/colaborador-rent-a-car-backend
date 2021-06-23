require("dotenv").config();


// unificar el devlopment y production

if (process.env.NODE_ENV === "production")
{
    //cargando las variables de entorno
    console.log(`production`);
    const logicGetVars = require("./logicinterface/logicGetVars");
    const resultado = logicGetVars.GetBackendVars();
    
}

const servidor = require("./server");
servidor.InitServer();