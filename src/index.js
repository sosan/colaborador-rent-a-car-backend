require("dotenv").config();


const Init = async () =>
{
    //cargando las variables de entorno
    const logicGetVars = require("./logicinterface/logicGetVars");
    const resultado = await logicGetVars.GetBackendVars();

    const servidor = require("./server");
    servidor.InitServer();

};    

Init();
