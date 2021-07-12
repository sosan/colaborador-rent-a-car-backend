require("dotenv").config();

const Init = async () => {
    // unificar el devlopment y production

    if (process.env.NODE_ENV === "production") {
        //cargando las variables de entorno
        const logicGetVars = require("./logicinterface/logicGetVars");
        const resultado = await logicGetVars.GetBackendVars();

        const servidor = require("./server");
        servidor.InitServer();

    }
    else {
        const servidor = require("./server");
        servidor.InitServer();

    }

};

Init();
