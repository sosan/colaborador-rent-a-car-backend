const dbInterfaces = require("../database/dbInterfaces");
const porcentajeVehiculo = require("../controllers/porcentajeTipoVehiculo");
const Joi = require("joi");

const DAY_IN_MILISECONDS = 86400000;
const DIA_DATE = new Date(DAY_IN_MILISECONDS);

// TODO: generar string a partir del secreto
const GenerateTokenBackendToFrontend = async () => {

    return process.env.TOKEN_BACKEND_TO_FRONTEND_SECRET;
};

const CheckTokenControlSchema = async (formulario, schema) => {

    let respuesta = {};

    const isTokenValid = await CheckToken(formulario.token, dbInterfaces.tokenFromFrontend);
    respuesta["isTokenValid"] = isTokenValid;

    if (isTokenValid === false) {
        return [respuesta, formulario];
    }

    // TODO: generar string a partir del secreto
    formulario["token"] = await GenerateTokenBackendToFrontend();
    if (formulario.conductor_con_experiencia === undefined) {
        formulario["conductor_con_experiencia"] = "off";
    }

    respuesta["isSchemaValid"] = await ControlSchema(formulario, schema);

    return [respuesta, formulario];

};

exports.CheckTokenFromGetAllVehicles = async (formulario) => {

    let schema = undefined;

    if (formulario.direct === true) {
        schema = Joi.object({

            direct: Joi.boolean().required(),
            vehiculo: Joi.string().required(),
            fase: Joi.number().required(),
            idioma: Joi.string().required(),
            success: Joi.string().required(),
            token: Joi.string().required(),
        });
    }
    else {
        schema = Joi.object({
            id: Joi.string().required(),
            location: Joi.object().required(),
            token: Joi.string().required(),
            direct: Joi.boolean().required(),
            useragent: Joi.object().required()
        });
    }


    const [respuesta, formularioChecked] = await CheckTokenControlSchema(formulario, schema);

    return [respuesta, formularioChecked];

};

exports.CheckTokenPostForm = async (formulario) => {

    const schema = Joi.object({
        anyos_carnet: Joi.number().required(),
        conductor_con_experiencia: Joi.string().required(),
        edad_conductor: Joi.number().required(),
        "fase": Joi.number().required(),
        fechaDevolucion: Joi.string().required(),
        horaDevolucion: Joi.string().required(),
        fechaRecogida: Joi.string().required(),
        horaRecogida: Joi.string().required(),
        "success": Joi.string().required(),
        token: Joi.string().required()

    });

    const [respuesta, formularioChecked] = await CheckTokenControlSchema(formulario, schema);

    return [respuesta, formularioChecked];

};

const CheckToken = async (token, tokenFromFrontend) => {

    let isValid = false;

    if (token === tokenFromFrontend) {
        isValid = true;
    }

    return isValid;
};

const ControlSchema = async (body, schema) => {

    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: false // remove unknown props
    };
    const validation = schema.validate(body, options);
    let isValid = false;

    if (validation.error === undefined) {
        isValid = true;
    }

    return isValid;

};

exports.GetCarsByReservadoExport = async (formulario) =>
{

    const cochesPreciosRaw = await GetCarsByReservado(formulario);
    return cochesPreciosRaw;
};

exports.GetMasValoradosExport = async () =>
{

    const masvalorados = await GetMasValorados();
    return masvalorados;

};

exports.GetPorcentajeVehiculosExport = async () =>
{

    const porcentaje = await GetPorcentajeVehiculos();
    return porcentaje;
};


exports.CheckResultadosCochesExport = async () =>
{

    const resultados = await CheckResultadosCoches();
    return resultados;

};


exports.GetAllCars = async (formulario) => {

    const cochesPreciosRaw = await GetCarsByReservado(formulario);

    if (cochesPreciosRaw.isOk === false) {
        console.error(`|- ${cochesPreciosRaw.errores}`);
        return res.send({
            "isOk": false,
            "data": [],
            "errorFormulario": "error_formulario1",
            "diasEntreRecogidaDevolucion": undefined
        });

    }

    if (cochesPreciosRaw.resultados.length <= 0) {
        return res.send({
            "isOk": true,
            "data": [],
            "errorFormulario": "error_formulario2",
            "diasEntreRecogidaDevolucion": undefined
        });
    }

    const masValorados = await GetMasValorados();

    const porcentajeVehiculo = await GetPorcentajeVehiculos();

    const resultadosObjetoCoches = await TransformarResultadosCoche(
        cochesPreciosRaw.resultados,
        cochesPreciosRaw.preciosPorClase,
        formulario,
        cochesPreciosRaw.datosSuplementoGenerico.resultados,
        cochesPreciosRaw.datosSuplementoTipoChofer.resultados,
        masValorados,
        porcentajeVehiculo,
        false
    );

    let datosDevueltos = { "isOk": false };
    if (resultadosObjetoCoches.isOk === false) {

        console.error(`|- ${resultadosObjetoCoches.errorFormulario}`);
        datosDevueltos = {
            "isOk": false,
            "data": [],
            "errorFormulario": resultadosObjetoCoches.errorFormulario,
            "diasEntreRecogidaDevolucion": resultadosObjetoCoches.diasEntreRecogidaDevolucion
        };
    }
    else {
        datosDevueltos = {
            "isOk": true,
            "data": resultadosObjetoCoches.resultadosCoches,
            "datosOrdenacion": cochesPreciosRaw.datosOrdenacion.resultados,
            "errorFormulario": resultadosObjetoCoches.errorFormulario,
            "diasEntreRecogidaDevolucion": resultadosObjetoCoches.diasEntreRecogidaDevolucion,
            "suplementogenerico_base": cochesPreciosRaw.datosSuplementoGenerico.resultados,
            "suplementotipochofer_base": cochesPreciosRaw.datosSuplementoTipoChofer.resultados,
            "preciosPorClase": cochesPreciosRaw.preciosPorClase,
            "condicionesgenerales": cochesPreciosRaw.condicionesgenerales.resultados,

        };

    }

    return datosDevueltos;

};




exports.GetCars = async (formulario, token) => {

    const cochesPreciosRaw = await GetCarsByReservado(formulario);

    if (cochesPreciosRaw.isOk === false) {
        console.error(`|- ${cochesPreciosRaw.errores}`);
        return res.send({
            "isOk": false,
            "data": [],
            "errorFormulario": "error_formulario1",
            "diasEntreRecogidaDevolucion": undefined
        });

    }

    if (cochesPreciosRaw.resultados.length <= 0) {
        return res.send({
            "isOk": true,
            "data": [],
            "errorFormulario": "error_formulario2",
            "diasEntreRecogidaDevolucion": undefined
        });
    }

    const masValorados = await GetMasValorados();

    const porcentajeVehiculo = await GetPorcentajeVehiculos();

    const resultadosObjetoCoches = await TransformarResultadosCoche(
        cochesPreciosRaw.resultados,
        cochesPreciosRaw.preciosPorClase,
        formulario,
        cochesPreciosRaw.datosSuplementoGenerico.resultados,
        cochesPreciosRaw.datosSuplementoTipoChofer.resultados,
        masValorados,
        porcentajeVehiculo,
        true,
        token
    );




    let datosDevueltos = { "isOk": false };
    if (resultadosObjetoCoches.isOk === false) {

        console.error(`|- ${resultadosObjetoCoches.errorFormulario}`);
        datosDevueltos = {
            "isOk": false,
            "data": [],
            "errorFormulario": resultadosObjetoCoches.errorFormulario,
            "diasEntreRecogidaDevolucion": resultadosObjetoCoches.diasEntreRecogidaDevolucion
        };
    }
    else {
        datosDevueltos = {
            "isOk": true,
            "data": resultadosObjetoCoches.resultadosCoches,
            "datosOrdenacion": cochesPreciosRaw.datosOrdenacion.resultados,
            "errorFormulario": resultadosObjetoCoches.errorFormulario,
            "diasEntreRecogidaDevolucion": resultadosObjetoCoches.diasEntreRecogidaDevolucion,
            "suplementogenerico_base": cochesPreciosRaw.datosSuplementoGenerico.resultados,
            "suplementotipochofer_base": cochesPreciosRaw.datosSuplementoTipoChofer.resultados,
            "preciosPorClase": cochesPreciosRaw.preciosPorClase,
            "condicionesgenerales": cochesPreciosRaw.condicionesgenerales.resultados,

        };

    }

    return datosDevueltos;

};


const GetCarsByReservado = async (formulario) => {

    const filtrado = await GenerarParametros(false, formulario.conductor_con_experiencia);
    const datosVehiculos = await dbInterfaces.GetCarsByReservado(filtrado);


    const datosOrdenacion = await dbInterfaces.GetClaseVehiculosOrdenados();
    if (datosOrdenacion.isOk === false) {
        const error = `NO hay collecion datos ordenados `;
        console.error(error);
        return { isOk: false, resultados: undefined, errores: error };
    }

    datosVehiculos["datosOrdenacion"] = datosOrdenacion;

    const allDatosSuplementoTipoChofer = await dbInterfaces.GetSuplementosTipoChofer();
    if (allDatosSuplementoTipoChofer.isOk === false) {
        const error = `| - NO hay collecion suplemento tipo chofer`;
        console.error(error);
        return { isOk: false, resultados: undefined, errores: error };
    }
    datosVehiculos["datosSuplementoTipoChofer"] = allDatosSuplementoTipoChofer;

    const datosSuplementoGenerico = await dbInterfaces.GetSuplementoGenerico();
    if (datosSuplementoGenerico.isOk === false) {
        const error = `| - NO hay collecion suplemento generico `;
        console.error(error);
        return { isOk: false, resultados: undefined, errores: error };
    }

    datosVehiculos["datosSuplementoGenerico"] = datosSuplementoGenerico;


    const tiposClases = await dbInterfaces.GetTiposClases();

    if (tiposClases.isOk === false) {
        const error = `| - NO hay collecion tiposclases `;
        console.error(error);
        return { isOk: false, resultados: undefined, errores: error };
    }

    const preciosPorClase = await dbInterfaces.GetPreciosPorClase(tiposClases.resultados);

    if (preciosPorClase.isOk === false) {
        const error = `| - NO hay collecion preciosporclase `;
        console.error(error);
        return { isOk: false, resultados: undefined, errores: error };
    }

    //TODO: mejorar estatico
    const transformadosPreciosPorClase = await TransformarPreciosPorClase(preciosPorClase.resultados);

    if (transformadosPreciosPorClase === undefined || transformadosPreciosPorClase === {}) {
        const error = `| - Transformacion no posible en preciosporclase `;
        console.error(error);
        return { isOk: false, resultados: undefined, errores: error };
    }

    datosVehiculos["preciosPorClase"] = transformadosPreciosPorClase;

    const condicionesGenerales = await dbInterfaces.GetCondicionesGenerales();
    datosVehiculos["condicionesgenerales"] = condicionesGenerales;

    // const pagoRecogida = await dbInterfaces.GetPagoRecogida();
    // datosVehiculos["pagoRecogida"] = pagoRecogida;

    return datosVehiculos;

};

// funcion donde genera el objeto para filtrar en la db
const GenerarParametros = async (reservado, conductor_con_experiencia) => {

    if (conductor_con_experiencia === "on") {
        return { "reservado": reservado };
    }
    else {
        return {
            "reservado": reservado,
        };
    }

};

const TransformarPreciosPorClase = async (preciosPorClase) => {

    let schema = {};

    for (let i = 0; i < preciosPorClase.length; i++) {

        const key = preciosPorClase[i]["CLASE"];

        let arrayPrecios = [];

        for (let key in preciosPorClase[i]) {
            if (key === "CLASE") continue;
            const valorPrecio = preciosPorClase[i][key];
            arrayPrecios.push(valorPrecio);

        }

        schema[key] = arrayPrecios;

    }

    return schema;


};
//--

const CheckResultadosCoches = async (
    resultadosCoches,
    preciosPorClase,
    formulario,
    suplementoGenerico,
    suplementoTipoChofer,
    masValorados,
    porcentajeTipoVehiculo,
    numeroDiasRecogidaDevolucion
) => {

    for (let i = 0; i < resultadosCoches.length; i++) {

        //comprobar los dias de reserva, si es mayor a 7 dias, aplicar PRECIOMAS7 * DIAS
        const claseVehiculo = resultadosCoches[i].clasevehiculo;
        const porcentaje = porcentajeTipoVehiculo[claseVehiculo];

        //si no existe la clase
        if (!preciosPorClase[claseVehiculo]) {
            console.error(`resultadoscoche ${resultadosCoches[i]} clasevehiculo ${claseVehiculo}`);
            continue;
        }

        const listadoPrecios = preciosPorClase[claseVehiculo];

        let precioDiaPorClase = 0;
        let precioTotalDias = 0;
        let precioDiaSinDescuento = listadoPrecios[1];

        if (numeroDiasRecogidaDevolucion > 7) {
            precioDiaPorClase = listadoPrecios[listadoPrecios.length - 1];
            precioTotalDias = precioDiaPorClase * numeroDiasRecogidaDevolucion;

        }
        else {
            precioDiaPorClase = listadoPrecios[1];
            precioTotalDias = listadoPrecios[numeroDiasRecogidaDevolucion];

        }


        resultadosCoches[i]["preciototaldias"] = precioTotalDias;

        const preciosSuplementoPorTipoChofer = await GenerarSuplementosPorTipoChofer(
            suplementoTipoChofer,
            formulario.conductor_con_experiencia,
            claseVehiculo
        );



        resultadosCoches[i]["preciopordia"] = precioDiaPorClase;
        resultadosCoches[i]["preciopordiasindescuento"] = precioDiaSinDescuento;
        resultadosCoches[i]["preciototalsindescuento"] = precioDiaSinDescuento * numeroDiasRecogidaDevolucion;
        resultadosCoches[i]["porcentaje"] = porcentaje;

        resultadosCoches[i]["preciosSuplementoPorTipoChofer"] = preciosSuplementoPorTipoChofer;

        const isValorado = await CheckIsMasValorado(resultadosCoches[i]["vehiculo"], masValorados);
        resultadosCoches[i]["masvalorado"] = isValorado;

        const suplementosGenericos = await GenerarSuplementosVehiculos(
            resultadosCoches[i].suplemento,
            suplementoGenerico
        );

        resultadosCoches[i]["suplementosgenericos"] = suplementosGenericos;

    }

    return resultadosCoches;

};


//----
const TransformarResultadosCoche = async (
    resultadosCoches,
    preciosPorClase,
    formulario,
    suplementoGenerico,
    suplementoTipoChofer,
    masValorados,
    porcentajeTipoVehiculo,
    procesarTiempo,
    token
) => {

    let diasEntreRecogidaDevolucion = 0;
    let numeroDiasRecogidaDevolucion = 1;

    if (token !== process.env.TOKEN_FOR_BACKEND_CHECK)
    {
        if (procesarTiempo === true) {
            diasEntreRecogidaDevolucion = await DiferenciaFechaRecogidaDevolucion(formulario);
    
            if (diasEntreRecogidaDevolucion === undefined) {
                return {
                    isOk: false,
                    resultadosCoches: undefined,
                    errorFormulario: "error_formulario3",
                    diasEntreRecogidaDevolucion: undefined
                };
    
            }
    
            numeroDiasRecogidaDevolucion = diasEntreRecogidaDevolucion + 1;
        }

    }


    const resultadoscochesChecked = await CheckResultadosCoches(
        resultadosCoches,
        preciosPorClase,
        formulario,
        suplementoGenerico,
        suplementoTipoChofer,
        masValorados,
        porcentajeTipoVehiculo,
        numeroDiasRecogidaDevolucion
    );

    return {
        isOk: true,
        resultadosCoches: resultadoscochesChecked,
        errorFormulario: "",
        diasEntreRecogidaDevolucion: numeroDiasRecogidaDevolucion
    };


};


const GenerarSuplementosPorTipoChofer = async (
    suplementoTipoChofer,
    conductor_con_experiencia,
    claseVehiculo
) => {

    let preciosSuplementoPorTipoChofer = {
        "no-oferta": [],
        "oferta": []
    };

    const currentTipoChofer = await ObtenerListadoTipoChofer(claseVehiculo, conductor_con_experiencia, suplementoTipoChofer);
    let objSuplemento = {};

    if (currentTipoChofer[claseVehiculo] > 0) {

        // objSuplemento["descripcion"] = `Cargo Conductor Joven: ${currentTipoChofer[claseVehiculo]} € por dia.`;
        // objSuplemento["tooltip"] = `El usuario debe pagar un suplmento por conductor joven de ${currentTipoChofer[claseVehiculo]} € por dia`;
        objSuplemento["descripcion"] = "cargo_conductor_joven";
        objSuplemento["tooltip"] = "tooltip_cargo_conductor_joven";
        objSuplemento["valor"] = currentTipoChofer[claseVehiculo];
        preciosSuplementoPorTipoChofer["no-oferta"].push(objSuplemento);

    }
    else {

        objSuplemento["descripcion"] = "sin_cargo_conductor_joven";
        objSuplemento["tooltip"] = "tooltip_sin_cargo_conductor_joven";
        objSuplemento["valor"] = 0;
        preciosSuplementoPorTipoChofer["oferta"].push(objSuplemento);

    }

    return preciosSuplementoPorTipoChofer;


};


const ObtenerListadoTipoChofer = async (claseVehiculo, conductor_con_experiencia, suplementoTipoChofer) => {

    let currentTipoChofer = {};

    if (conductor_con_experiencia === "on") {
        if (claseVehiculo === "motos2") {
            currentTipoChofer = suplementoTipoChofer["choferPlus252Motos"];
        }
        else {
            currentTipoChofer = suplementoTipoChofer["choferPlus232Cars"];
        }
    }
    else {
        if (claseVehiculo === "motos2") {
            currentTipoChofer = suplementoTipoChofer["choferPlusNovelMotos"];
        }
        else {
            currentTipoChofer = suplementoTipoChofer["choferPlusNovelCars"];
        }

    }

    return currentTipoChofer;

};


const GenerarSuplementosVehiculos = async (suplementos, suplementoGenerico) => {

    let suplementosGenericos = [];

    for (let j = 0; j < suplementos.length; j++) {

        const keySuplemento = suplementos[j];
        const contenidoSuplemento = suplementoGenerico[keySuplemento];

        if (contenidoSuplemento.valor > 0) {
            // let texto = contenidoSuplemento["tooltip_pagar"];
            // contenidoSuplemento["tooltip_pagar"] = texto.replace("X", contenidoSuplemento["valor"] );

            suplementosGenericos.push({
                "titulo": contenidoSuplemento["titulo_pagar"],
                "tooltip": contenidoSuplemento["tooltip_pagar"],
                "valor": contenidoSuplemento["valor"]
            });
        }
        else {
            suplementosGenericos.push({
                "titulo": contenidoSuplemento["titulo_gratis"],
                "tooltip": contenidoSuplemento["tooltip_gratis"],
                "valor": 0
            });
        }

    }

    return suplementosGenericos;

};

const DiferenciaFechaRecogidaDevolucion = async (formulario) => {
    const fechaRecogida = await ObtenerConversionFecha(
        formulario.fechaRecogida,
        formulario.horaRecogida,

    );

    if (fechaRecogida === undefined) {
        //TODO: mejorar con un redirect etc
        console.error("schema invalido")
        return undefined;
    }

    let fechaDevolucion = await ObtenerConversionFecha(
        formulario.fechaDevolucion,
        formulario.horaDevolucion,

    );

    if (fechaDevolucion === undefined) {
        //TODO: mejorar con un redirect etc
        console.error("schema invalido")
        return undefined;
    }

    // comprobar que fechaDevolucion es mayor a la fechaRecogida
    if (fechaDevolucion < fechaRecogida) {
        console.error("FEchaDevolucion es menor a la fechaRecogida");
        return undefined;
    }

    const milisecondsEntreRecogidaDevolucion = fechaDevolucion - fechaRecogida;
    const diasEntreRecogidaDevolucion = Math.round(milisecondsEntreRecogidaDevolucion / DAY_IN_MILISECONDS);

    // console.log("dias=" + diasEntreRecogidaDevolucion);

    return diasEntreRecogidaDevolucion;
};

const ObtenerConversionFecha = async (fechaRaw, horaRaw) => {


    let fechaRecogidaFormSplitted = undefined;
    if (fechaRaw.split(",").length >= 2) {
        fechaRecogidaFormSplitted = fechaRaw.split(",")[1].split("-");

    }
    else {
        fechaRecogidaFormSplitted = fechaRaw.split("-");
    }

    const anyo = fechaRecogidaFormSplitted[2] - 0;
    const mes = fechaRecogidaFormSplitted[1] - 0;
    const dia = fechaRecogidaFormSplitted[0] - 0;

    // const horaSplitted = horaRaw.split(":");
    // const hora = horaSplitted[0] - 0;


    //comprobar que el mes este entre 0 y 11, dia entre 1 y 30 y 1900-
    if (mes < 1 || mes > 12) {
        console.error("Mes - Conversion erronea");
        return undefined;
    }

    if (anyo < 1900) {
        console.error("Anyo - Conversion erronea");
        return undefined;
    }

    if (dia < 1 || dia > 31) {
        console.error("Dia - Conversion erronea");
        return undefined;
    }

    const fechaRecogida = new Date(`${anyo}-${mes}-${dia} ${horaRaw}:00Z`);

    return fechaRecogida;


};


const CheckIsMasValorado = async (vehiculo, masvalorados) => {

    let isValorado = false;
    for (let i = 0; i < masvalorados.length; i++) {

        if (vehiculo === masvalorados[i]) {
            isValorado = true;
            break;
        }

    }

    return isValorado;

};

const GetMasValorados = async () => {

    const result = await dbInterfaces.GetMasValorados();
    return result;


};

const GetPorcentajeVehiculos = async () => {

    let porcentajeTipoVehiculo = await porcentajeVehiculo.GetPorcentajeTipoVehiculo();

    if (porcentajeTipoVehiculo === undefined) {
        porcentajeTipoVehiculo = await dbInterfaces.GetPorcentajeTipoVehiculo();
        porcentajeVehiculo.SetPorcentajeTipoVehiculo(porcentajeTipoVehiculo);
    }

    return porcentajeTipoVehiculo;


};
