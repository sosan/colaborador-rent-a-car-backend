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
        "compradorId": formulario.id,
        "faseActual": 1,
        "rutaDatos": [
            {
                "fase": 1,
                ...formulario
            }
        ]

    }

    let isInserted = false;
    let incrementalCount = 1;
    while (isInserted === false)
    {
        isInserted = await dbInterfaces.InsertarPosibleComprador(comprador);
        if (isInserted === false) {
            await sleep(5000 * incrementalCount);
            incrementalCount++;
        }
    }
    return isInserted;

};



exports.AñadirEstadisticasTest = async (formulario, collection) => {

    formulario["alta"] = new Date(new Date().toUTCString());
    const comprador = {
        "compradorId": formulario.id,
        "faseActual": 1,
        "rutaDatos": [
            {
                "fase": 1,
                ...formulario
            }
        ]

    }

    let isInserted = false;
    let incrementalCount = 1;
    while (isInserted === false) {
        isInserted = await dbInterfaces.InsertarPosibleComprador(comprador);
        if (isInserted === false) {
            await sleep(5000 * incrementalCount);
            incrementalCount++;
        }
    }
    return isInserted;

};


const sleep = async (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

};





exports.ActualizarEstadisticas = async (formulario) => {

    // formulario["alta"] = new Date(new Date().toUTCString());
    // formulario.fase = formulario.fase - 0;

    // const comprador = {
    //     "compradorId": formulario.success,
    //     "faseActual": formulario.fase,
    //     "rutaDatos":
    //     {
    //         "fase": formulario.fase,
    //         ...formulario
    //     }

    // }

    // const resultado = dbInterfaces.ActualizarPosibleComprador(comprador);



    formulario["alta"] = new Date(new Date().toUTCString());
    formulario["fase"] = formulario["fase"] - 0;

    // const visitanteActualizado = {
    //     // "faseActual": formulario["fase"],
    //     "rutaDatos": [
    //         {
    //             ...formulario
    //         }
    //     ]

    // };

    const visitanteActualizado = {
        ...formulario
    };


    let isInserted = false;
    let incrementalCount = 1;
    while (isInserted === false) {
        isInserted = await dbInterfaces.ActualizarPosibleComprador(formulario.success, formulario["fase"], visitanteActualizado);
        if (isInserted === false) {
            await sleep(5000 * incrementalCount);
            incrementalCount++;
        }
    }
    return isInserted;



};
