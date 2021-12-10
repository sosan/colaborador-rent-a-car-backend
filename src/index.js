require("dotenv").config();

const Init = async () =>
{
    //cargando las variables de entorno desde vault/db con pgp/...
    const logicGetVars = require("./logicinterface/logicGetVars");
    await logicGetVars.GetBackendVars();

    const servidor = require("./server");
    servidor.InitServer();

};    

Init();
