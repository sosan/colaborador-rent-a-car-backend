const dbInterfaces = require("../database/dbInterfaces");
const { EnumTiposErrores } = require("../errors/exceptions");

const DAY_IN_MILISECONDS = 86400000;
const DIA_DATE = new Date(DAY_IN_MILISECONDS);

// TODO: generar string a partir del secreto
exports.GenerateTokenBackendToFrontend = async () =>
{

    return process.env.TOKEN_BACKEND_TO_FRONTEND_SECRET;
};



exports.GetCarsByReservado = async (formulario) => {

    const resultados = await dbInterfaces.GetCarsByReservado(0, formulario.conductor_con_experiencia);
    return resultados;

};


exports.GetPreciosPorClase = async () => {
    const tiposClases = await dbInterfaces.GetTiposClases();

    if (tiposClases.isOk === false) {
        console.error(tiposClases.errores);
        return tiposClases;
    }

    const preciosPorClase = await dbInterfaces.GetPreciosPorClase(tiposClases.resultados);

    if (preciosPorClase.isOk === false) {
        console.error(`|- ${preciosPorClase.errores}`);
        return preciosPorClase;
    }

    const transformadosPreciosPorClase = await TransformarPreciosPorClase(preciosPorClase.resultados);

    if (transformadosPreciosPorClase === undefined || transformadosPreciosPorClase === {}) {
        console.error(`|- ${transformadosPreciosPorClase}`);
        return { isOk: false, resultados: transformadosPreciosPorClase, errores: "Transformacion no posible" };
    }

    return { isOk: true, resultados: transformadosPreciosPorClase, errores: "" };


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








exports.TransformarResultadosCoche = async (resultadosCoches, preciosPorClase, formulario) => {

    const diasEntreRecogidaDevolucion = await DiferenciaFechaRecogidaDevolucion(formulario);

    if (diasEntreRecogidaDevolucion === undefined) {
        return {
            isOk: false,
            resultadosCoches: undefined,
            errorFormulario: "Fecha Recogida Incorrecta",
            diasEntreRecogidaDevolucion: undefined
        };

    }

    const numeroDiasRecogidaDevolucion = diasEntreRecogidaDevolucion + 1;
    
    // no controlamos si hay solo 1 dia de separacion
    // if (diasEntreRecogidaDevolucion === 0) {
    //     console.error("SEPARACION DE DIAS ES MENOR A 1 DIA - TransformarResultadosCoche");
    //     return {
    //         isOk: false,
    //         resultadosCoches: undefined,
    //         errorFormulario: "Separacion de dias menor a 1 dia",
    //         diasEntreRecogidaDevolucion: undefined
    //     };
    // }

    // let resultadosCochesTemporal = [];
    for (let i = 0; i < resultadosCoches.length; i++) {

        
        // en teoria la db nos ha traido los coches correctos segun la edad
        //comprobar si tiene la experiencia/edad minima
        // if (formulario.conductor_con_experiencia === "off")
        // {
        //     const edadChoferFormulario = resultadosCoches[i].edadChofer - 0;
        //     if (edadChoferFormulario > 26 && edadChoferFormulario < 69)
        //     {
        //         continue;
        //     }
        // }
        // else
        // {
        //     resultadosCochesTemporal.push(resultadosCoches[i]);
        // }
        

        //comprobar los dias de reserva, si es mayor a 7 dias, aplicar PRECIOMAS7 * DIAS
        const claseVehiculo = resultadosCoches[i].clasevehiculo;

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
            resultadosCoches[i]["preciototalsindescuento"] = precioDiaPorClase * numeroDiasRecogidaDevolucion;
            
        }
        
        resultadosCoches[i]["preciototaldias"] = precioTotalDias;
        resultadosCoches[i]["preciopordia"] = precioDiaPorClase;
        resultadosCoches[i]["preciopordiasindescuento"] = precioDiaSinDescuento;
        resultadosCoches[i]["preciototalsindescuento"] = precioDiaSinDescuento * numeroDiasRecogidaDevolucion;

    }

    return {
        isOk: true,
        resultadosCoches: resultadosCoches,
        errorFormulario: "",
        diasEntreRecogidaDevolucion: numeroDiasRecogidaDevolucion
    };


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

    console.log("dias=" + diasEntreRecogidaDevolucion);

    return diasEntreRecogidaDevolucion;
};

const ObtenerConversionFecha = async (fechaRaw, horaRaw) => {


    const fechaRecogidaFormSplitted = fechaRaw.split(",")[1].split("-");
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

