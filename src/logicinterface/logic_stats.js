const dbInterfaces = require("../database/dbInterfaces");



exports.CheckToken = async (res, req, tokenFromFrontend) => {

    let isValid = false;

    if (req.useragent.browser === "node-fetch") {
        isValid = true;
    }
    else {
        isValid = false;
    }

    if (req.body.token === tokenFromFrontend) {
        isValid = true;
    }
    else {
        isValid = false;
    }

    return isValid;

};

exports.AñadirEstadisticas = async (formulario) => {

    formulario["alta"] = new Date(new Date().toUTCString());
    const comprador = {
        "compradorId": formulario.success,
        "faseActual": formulario.fase,
        "rutaDatos":
        {
            "fase": formulario.fase,
            ...formulario
        }

    }

    const resultado = dbInterfaces.InsertarPosibleComprador(comprador);

};




exports.ActualizarEstadisticas = async (formulario) => {

    formulario["alta"] = new Date(new Date().toUTCString());
    const comprador = {
        "compradorId": formulario.success,
        "faseActual": formulario.fase,
        "rutaDatos":
        {
            "fase": formulario.fase,
            ...formulario
        }

    }

    const resultado = dbInterfaces.ActualizarPosibleComprador(comprador);

};
