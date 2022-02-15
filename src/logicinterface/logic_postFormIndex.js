const dbInterfaces = require("../database/dbInterfaces");
const porcentajeVehiculoInterface = require("../controllers/porcentajeTipoVehiculo");
const Joi = require("joi");

const DAY_IN_MILISECONDS = 86400000;

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

    let datosDevueltos = { };
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




    let datosDevueltos = { };
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

    const filtrado = await GenerarParametros(false, formulario);
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
    // no es necesario si viene de index

    const [rangoFechaInicio, temporadaFechaRecogida] = await this.FechaSuperpuesta(formulario.fechaRecogida);
    const [rangoFechaFin, temporadaFechaDevolucion] = await this.FechaSuperpuesta(formulario.fechaDevolucion);

    
    let preciosPorClase = [];
    let listadoDiasTemporada = [];
    if (rangoFechaInicio === rangoFechaFin)
    {
        const precios = await dbInterfaces.GetPreciosPorClase(tiposClases.resultados, temporadaFechaRecogida);
        preciosPorClase.push(precios);
    }
    else
    {
        listadoDiasTemporada = await this.CalcularTemporadaSegmentada(
            formulario.fechaRecogida, 
            formulario.fechaDevolucion,
            rangoFechaInicio,
            rangoFechaFin
        );

        for (let i = 0; i < listadoDiasTemporada.length; i++)
        {
            const precios = await dbInterfaces.GetPreciosPorClase(tiposClases.resultados, listadoDiasTemporada[i].temporadaFechaInicio);
            preciosPorClase.push(precios);

        }

    }

    
    /**
 
[
{
    fechaInicio: { },
    fechaFin: { },
    diasEntreFechas: 45,
    temporadaFechaInicio: "1",
    temporadaFechaFin: "1",
},
{
    fechaInicio: { },
    fechaFin: { },
    diasEntreFechas: 1,
    temporadaFechaInicio: "2",
    temporadaFechaFin: "2",
},
]
 
 
*/ 

    
    if (preciosPorClase.length === 0) {
        const error = `| - NO hay collecion preciosporclase `;
        console.error(error);
        return { isOk: false, resultados: undefined, errores: error };
    }

    //TODO: mejorar estatico
    const transformadosPreciosPorClase = await TransformarPreciosPorClase(preciosPorClase, listadoDiasTemporada);

    if (transformadosPreciosPorClase === undefined) {
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


const ConversionTextoAFecha = async (textoFecha) =>
{

    if (textoFecha === undefined) return;

    if (textoFecha.toString().indexOf("T") > 1) {

        let fechaSplitted = textoFecha.split("T")[0];
        fechaSplitted = fechaSplitted.split("-");

        const anyo = fechaSplitted[0] - 0;
        const mes = fechaSplitted[1] - 1;
        const dia = fechaSplitted[2] - 0;

        textoFecha = new Date(anyo, mes, dia);

    }
    else {

        const fechaSplitted = textoFecha.split("-");

        const dia = fechaSplitted[0] - 0;
        const mes = fechaSplitted[1] - 1;
        const anyo = fechaSplitted[2] - 0;

        textoFecha = new Date(anyo, mes, dia);

    }

    let isValidDate = Date.parse(textoFecha);

    if (isNaN(isValidDate) === true) {
        console.log("textoFechaRecogida" + textoFecha);
    }

    return textoFecha;

};

exports.CalcularTemporada = async (textoFechaRecogida) =>
{
    if (textoFechaRecogida === undefined) return;
    textoFechaRecogida = await ConversionTextoAFecha(textoFechaRecogida);
    
    const fechaRecogida = new Date(textoFechaRecogida);

    const temporada = await SwitchTemporada(fechaRecogida);
    return temporada;

};

const SwitchTemporada = async (fecha) =>
{
    let temporada = "3";

    switch (fecha.getMonth()) {
        case 0: // enero
        case 1: // febrero
        case 2: // marzo
            temporada = "1";
            break;
        case 3: // abril
        case 4: // mayo
            temporada = "2";
            break;
        case 5: // junio
            if (fecha.getDate() >= 1 && fecha.getDate() <= 15) {
                temporada = "2";
            }
            else {
                temporada = "3";
            }
            break;
        case 6: // julio
            temporada = "3";
            break;
        case 7: // agosto
            temporada = "3";
            break;
        case 8: // septiembre
            if (fecha.getDate() >= 1 && fecha.getDate() <= 15) {
                temporada = "3";
            }
            else {
                temporada = "2";
            }
            break;
        case 9: // octubre
            temporada = "2";
            break;
        case 10: // noviembre
            temporada = "1";
            break;
        case 11: // diciembre
            temporada = "1";
            break;
        default:
            temporada = "3";
            break;
    }

    return temporada;

}

exports.CalcularTemporadaSegmentada = async (textoFechaRecogida, textoFechaDevolucion, rangoFechaInicio, rangoFechaFin) =>
{

    if (textoFechaRecogida === undefined || textoFechaDevolucion === undefined) return;

    textoFechaRecogida = await ConversionTextoAFecha(textoFechaRecogida);
    let fechaRecogida = new Date(textoFechaRecogida);
    fechaRecogida.setHours(0, 0, 0, 0);

    textoFechaDevolucion = await ConversionTextoAFecha(textoFechaDevolucion);
    let fechaDevolucion = new Date(textoFechaDevolucion);
    fechaDevolucion.setHours(0, 0, 0, 0);
    
    const yearRecogida = fechaRecogida.getFullYear();
    const yearDevolucion = fechaDevolucion.getFullYear();

    if (yearDevolucion !== yearRecogida)
    {
        //TODO: mejorarlo para años diferentes
        console.log("años diferentes");
    }
    
    let listadoTemporadaDias = [];

    const pivotPoints = await DiasFinalesMeses(yearRecogida);

    for (let key in pivotPoints)
    {
        const fechaFin = pivotPoints[key]["fin"];
        const fechaInicio = pivotPoints[key]["inicio"];
        // console.log("fechaFin =>" + new Date(fechaFin))
        // console.log("fecha devolucion =>" + new Date(fechaDevolucion))
        // console.log("dfgskjdflgsfg" )
        if (fechaFin >= fechaDevolucion)
        {
            console.log("mayor");
            
            const temporadaFechaInicio = await SwitchTemporada(fechaInicio);
            const temporadaFechaFin = await SwitchTemporada(fechaDevolucion);

            if (temporadaFechaInicio !== temporadaFechaFin)
            {
                //// enviar de nuevo
            }

            let diasEntreFechas = await CalcularDiasEntrePivotes(
                fechaInicio,
                fechaDevolucion,
            );

            listadoTemporadaDias.push(
                {
                    "fechaInicio": fechaInicio,
                    "fechaFin": fechaDevolucion,
                    "diasEntreFechas": diasEntreFechas,
                    "temporadaFechaInicio": temporadaFechaInicio,
                    "temporadaFechaFin": temporadaFechaFin
                });

            break;
        }
        else
        {
            console.log("antes---")

            const temporadaFechaInicio = await SwitchTemporada(fechaRecogida);
            const temporadaFechaFin = await SwitchTemporada(fechaFin);

            if (temporadaFechaInicio !== temporadaFechaFin) {
                //// enviar de nuevo
            }

            let diasEntreFechas = await CalcularDiasEntrePivotes(
                fechaRecogida,
                fechaFin
            );


            listadoTemporadaDias.push(
            {
                "fechaInicio": fechaRecogida,
                "fechaFin": fechaFin,
                "diasEntreFechas": diasEntreFechas,
                "temporadaFechaInicio": temporadaFechaInicio,
                "temporadaFechaFin": temporadaFechaFin
            });
        }

    }

    return listadoTemporadaDias;


    // switch (rangoFechaInicio) 
    // {
    //     case 1:

    //         if (rangoFechaFin === 2 || rangoFechaFin === 3)
    //         {
    //             if (fechaDevolucion.getMonth() === 3)
    //             {

    //                 let [diasEntreFechaRecogidaFechaPivote, diasEntreFechaPivoteFechaDestino ] = await CalcularDiasEntrePivotes(
    //                     yearRecogida,
    //                     fechaRecogida,
    //                     fechaDevolucion
    //                 );
                    
    //                 listadoTemporadaDias.push(
    //                 {
    //                     "diasEntreFechaRecogidaFechaPivote": diasEntreFechaRecogidaFechaPivote,
    //                     "diasEntreFechaPivoteFechaDestino": diasEntreFechaPivoteFechaDestino,
    //                     "temporadaFechaRecogidaFechaPivote": "1",
    //                     "temporadaFechaPivoteFechaDevolucion": "2",
    //                 });

    //             }

    //             if (fechaDevolucion.getMonth() === 4 || fechaDevolucion.getMonth() === 5)
    //             {

    //                 if (pivotPoints[rangoFechaFin] > fechaDevolucion)
    //                 {

    //                 }
    //                 else
    //                 {
                        
    //                 }

    //                 let [diasEntreFechaRecogidaFechaPivote, diasEntreFechaPivoteFechaDestino] = await CalcularDiasEntrePivotes(
    //                     yearRecogida,
    //                     fechaRecogida,
    //                     pivotPoints["1"]
    //                 );
    //                 listadoTemporadaDias.push(
    //                     {
    //                         "diasEntreFechaRecogidaFechaPivote": diasEntreFechaRecogidaFechaPivote,
    //                         "diasEntreFechaPivoteFechaDestino": diasEntreFechaPivoteFechaDestino,
    //                         "temporadaFechaRecogidaFechaPivote": "1",
    //                         "temporadaFechaPivoteFechaDevolucion": "2",
    //                     });

    //                 const fechaInit = new Date(pivotPoints["1"]);
    //                 fechaInit.setDate(fechaInit.getDate() + 1);
    //                 [diasEntreFechaRecogidaFechaPivote, diasEntreFechaPivoteFechaDestino] = await CalcularDiasEntrePivotes(
    //                     yearRecogida,
    //                     fechaInit,
    //                     fechaDevolucion,
    //                 );

    //                 listadoTemporadaDias.push(
    //                     {
    //                         "diasEntreFechaRecogidaFechaPivote": diasEntreFechaRecogidaFechaPivote,
    //                         "diasEntreFechaPivoteFechaDestino": diasEntreFechaPivoteFechaDestino,
    //                         "temporadaFechaRecogidaFechaPivote": "2",
    //                         "temporadaFechaPivoteFechaDevolucion": "2",
    //                     });

                    

    //             }
    //         }

    //         if (rangoFechaFin === 4)
    //         {
    //             if (fechaDevolucion.getMonth() === 5)
    //             {

    //             }
    //         }


    //     break;
    //     case 2:
    //     case 3:
            
    //     break;
    
    //     default:
    //         break;
    // }

    // (StartDate1 <= EndDate2) and(EndDate1 >= StartDate2)

    // const [rangoFechaInicio, temporadaFechaRecogida] = await FechaSuperpuesta(fechaRecogida);
    // const [rangoFechaFin, temporadaFechaDevolucion] = await FechaSuperpuesta(fechaDevolucion);

};


const DiasFinalesMeses = async (yearRecogida) =>
{

    
    let diaFinalRango1 = new Date(yearRecogida, 3, 1);
    diaFinalRango1.setDate(diaFinalRango1.getDate() - 1);
    
    let diaFinalRango2 = new Date(yearRecogida, 5, 15);
    let diaFinalRango3 = new Date(yearRecogida, 8, 15);

    let diaFinalRango4 = new Date(yearRecogida, 10, 1);
    diaFinalRango4.setDate(diaFinalRango4.getDate() - 1);

    let diaFinalRango5 = new Date(yearRecogida + 1, 0, 1);
    diaFinalRango5.setDate(diaFinalRango5.getDate() - 1);

    let diaInicioRango1 = new Date(yearRecogida, 0, 1);
    let diaInicioRango2 = new Date(yearRecogida, 3, 1);
    let diaInicioRango3 = new Date(yearRecogida, 5, 16);
    let diaInicioRango4 = new Date(yearRecogida, 8, 16);
    let diaInicioRango5 = new Date(yearRecogida, 10, 1);
    
    diaFinalRango1.setHours(0, 0, 0, 0);
    diaFinalRango2.setHours(0, 0, 0, 0);
    diaFinalRango3.setHours(0, 0, 0, 0);
    diaFinalRango4.setHours(0, 0, 0, 0);
    diaFinalRango5.setHours(0, 0, 0, 0);

    diaInicioRango1.setHours(0, 0, 0, 0);
    diaInicioRango2.setHours(0, 0, 0, 0);
    diaInicioRango3.setHours(0, 0, 0, 0);
    diaInicioRango4.setHours(0, 0, 0, 0);
    diaInicioRango5.setHours(0, 0, 0, 0);

    const matriz = {
        1: { "inicio": diaInicioRango1, "fin": diaFinalRango1 },
        3: { "inicio": diaInicioRango2, "fin": diaFinalRango2 },
        7: { "inicio": diaInicioRango3, "fin": diaFinalRango3 },
        9: { "inicio": diaInicioRango4, "fin": diaFinalRango4 },
        11: { "inicio": diaInicioRango5, "fin": diaFinalRango5 },
    };

    return matriz;

};

const CalcularDiasEntrePivotes = async (fechaInicio, fechaFin) =>
{

    // let fechaPivote = new Date(yearRecogida, fechaFin.getMonth(), 1);
    // fechaPivote.setDate(fechaPivote.getDate() - 1);

    let diferenciaFechas = fechaFin.getTime() - fechaInicio.getTime();
    let diasEntreFechas = (Math.round(diferenciaFechas / 86400000)) + 1;

    // diferenciaFechas = fechaFin.getTime() - fechaPivote.getTime();
    // let diasEntreFechaPivoteFechaDestino = Math.round(diferenciaFechas / 86400000);

    return diasEntreFechas;
}


exports.FechaSuperpuesta = async (fecha) =>
{
    if (fecha === undefined) return [undefined, undefined];

    fecha = await ConversionTextoAFecha(fecha);
    let rango = [-1,"-1"];

    switch (fecha.getMonth()) {
        case 0: // enero
        case 1: // febrero
        case 2: // marzo
            rango = [1, "1"] ;
            break;
        case 3: // abril
        case 4: // mayo
            rango = [2, "2"];
            break;
        case 5: // junio
            if (fecha.getDate() >= 1 && fecha.getDate() <= 15) {
                rango = [3, "2"];
            }
            else {
                rango = [4, "3"];
            }
            break;
        case 6: // julio
            rango = [5, "3"];
            break;
        case 7: // agosto
            rango = [6, "3"];
            break;
        case 8: // septiembre
            if (fecha.getDate() >= 1 && fecha.getDate() <= 15) {
                rango = [7, "3"];
            }
            else {
                rango = [8, "2"];
            }
            break;
        case 9: // octubre
            rango = [9, "2"];
            break;
        case 10: // noviembre
            rango = [10, "1"];
            break;
        case 11: // diciembre
            rango = [11, "1"];
            break;
        default:
            rango = [-1, "-1"];
            break;
    }

    return rango;

};

// funcion donde genera el objeto para filtrar en la db
const GenerarParametros = async (reservado, formulario) => {

    let dato = { "reservado": reservado };
    return dato;

};

const TransformarPreciosPorClase = async (preciosPorClase, listadoDiasTemporada) => {

    let schema = { };
    // schema["fechas"] = [];

    // for (let i = 0; i < listadoDiasTemporada.length; i++)
    // {
    //     schema["fechas"].push({
    //         "diasEntreFechas": listadoDiasTemporada[i].diasEntreFechas,
    //         "temporada": listadoDiasTemporada[i].temporadaFechaInicio,

    //     })

    // }

    for (let i = 0; i < preciosPorClase.length; i++) 
    {

        if (preciosPorClase[i].resultados.length <= 0)
        {
            break;
        }

        const temporada = preciosPorClase[i].resultados[0]["TEMPORADA"];
        
        let elementos = {};

        for (let j = 0; j < preciosPorClase[i].resultados.length; j++)
        {

            const keyClase = preciosPorClase[i].resultados[j]["CLASE"];
    
            let arrayPrecios = [];
    
            for (let key in preciosPorClase[i].resultados[j])
            {
                if (key === "CLASE") continue;
                const valorPrecio = preciosPorClase[i].resultados[j][key];
                arrayPrecios.push(valorPrecio);
    
            }
    
            elementos[keyClase] = arrayPrecios;

        }

        for (let o = 0; o < listadoDiasTemporada.length; o++) 
        {

            if (listadoDiasTemporada[o].temporadaFechaInicio.toString() === preciosPorClase[i].resultados[0]["TEMPORADA"].toString())
            {
                elementos["dias"] = listadoDiasTemporada[o].diasEntreFechas;
            }
            
            
        }

        schema[temporada] = elementos;

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
        let saltar = false;

        let precioDiaPorClase = 0;
        let precioTotalDias = 0;
        let precioDiaSinDescuento = 0;
        
        for (const keyPrecioPorTemporada in preciosPorClase)
        {
            if (!preciosPorClase[keyPrecioPorTemporada][claseVehiculo])
            {
                // console.error(`resultadoscoche ${resultadosCoches[i]} clasevehiculo ${claseVehiculo}`);
                saltar = true;
                break;
            }
            
            const listadoPrecios = preciosPorClase[keyPrecioPorTemporada][claseVehiculo];
            precioDiaSinDescuento = listadoPrecios[2]; ///////--------------
            let numeroDias = numeroDiasRecogidaDevolucion;

            if ("dias" in preciosPorClase[keyPrecioPorTemporada] === true)
            {
                numeroDias = preciosPorClase[keyPrecioPorTemporada]["dias"] - 0;
            }
            
            if (numeroDias > 7) {
                precioDiaPorClase = listadoPrecios[listadoPrecios.length - 1];
                precioTotalDias += precioDiaPorClase * numeroDias;
    
            }
            else {
                precioDiaPorClase = listadoPrecios[2]; /////////////---------
                precioTotalDias += listadoPrecios[numeroDias + 1];
    
            }

        }

        if (saltar === true)
        {
            continue;
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

    if (conductor_con_experiencia === "on" || conductor_con_experiencia === "true")
    {
        if (claseVehiculo === "motos2") {
            currentTipoChofer = suplementoTipoChofer["choferPlus252Motos"];
        }
        else {
            currentTipoChofer = suplementoTipoChofer["choferPlus232Cars"];
        }
    }
    else
    {
        if (claseVehiculo === "motosC" || claseVehiculo === "motosD") {
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
    let anyo = 0;
    let mes = 0;
    let dia = 0;
    if (fechaRaw.split(",").length >= 2) {
        fechaRecogidaFormSplitted = fechaRaw.split(",")[1].split("-");

    }
    else {

        if (fechaRaw.indexOf("T") !== -1)
        {
            fechaRaw = fechaRaw.split("T")[0];

        }
        fechaRecogidaFormSplitted = fechaRaw.split("-");
    }

    // anyo = fechaRecogidaFormSplitted[2] - 0;
    // mes = fechaRecogidaFormSplitted[1] - 0;
    // dia = fechaRecogidaFormSplitted[0] - 0;

    dia = fechaRecogidaFormSplitted[2] - 0;
    mes = fechaRecogidaFormSplitted[1] - 0;
    anyo = fechaRecogidaFormSplitted[0] - 0;

    //comprobar que el mes este entre 0 y 11, dia entre 1 y 30 y 1900-
    if (mes < 1 || mes > 12) 
    {
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

    let porcentajeTipoVehiculo = await porcentajeVehiculoInterface.GetPorcentajeTipoVehiculo();

    if (porcentajeTipoVehiculo === undefined) {
        porcentajeTipoVehiculo = await dbInterfaces.GetPorcentajeTipoVehiculo();
        porcentajeVehiculoInterface.SetPorcentajeTipoVehiculo(porcentajeTipoVehiculo);
    }

    return porcentajeTipoVehiculo;


};
