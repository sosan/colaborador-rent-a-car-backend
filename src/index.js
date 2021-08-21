require("dotenv").config();


const Init = async () =>
{
    //cargando las variables de entorno
    const logicGetVars = require("./logicinterface/logicGetVars");
    await logicGetVars.GetBackendVars();

    const servidor = require("./server");
    servidor.InitServer();

};    

Init();
