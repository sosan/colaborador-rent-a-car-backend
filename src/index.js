require("dotenv").config();
const logicGetVars = require("./logicinterface/logicGetVars");

const Init = async () => {
    // unificar el devlopment y production
    const resultado = await logicGetVars.GetBackendVars();

    const servidor = require("./server");
    servidor.InitServer();

    // if (process.env.NODE_ENV === "production") {
    //     //cargando las variables de entorno

    // }
    // else {
    //     const servidor = require("./server");
    //     servidor.InitServer();

    // }

};

Init();
