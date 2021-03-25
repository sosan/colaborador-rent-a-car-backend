const { ResumeToken } = require('mongodb');
const mongo_dao = require('../database/mongo_dao');

const DAY_IN_MILISECONDS = 86400000;

/**
 * Devuelve listado de resultados por fecha
 * @param {Array} fecha
 * @returns {null|Array} nulo o listado de resultados
 */

exports.GetCarsByReservado = async (formulario) => {

    const resultados = await mongo_dao.GetCarsByReservado(0, formulario.conductor_con_experiencia);
    return resultados;

};

exports.GetPreciosPorClase = async () =>
{
    const tiposClases = await mongo_dao.GetTiposClases();

    if (tiposClases === undefined)
    {
        console.error("FALTA TIPO DE CLASES")
        return undefined;
    }

    const preciosPorClase = await mongo_dao.GetPreciosPorClase(tiposClases);

    if (preciosPorClase === undefined)
    {
        console.error("FALTA TIPO DE CLASES")
        return undefined;
    }

    const transformadosPreciosPorClase = await TransformarPreciosPorClase(preciosPorClase);

    if (transformadosPreciosPorClase === undefined) {
        console.error("FALTA TIPO DE CLASES")
        return undefined;
    }

    return transformadosPreciosPorClase;


};


const TransformarPreciosPorClase = async (preciosPorClase) =>
{

    let schema = {};

    for (let i = 0; i < preciosPorClase.length; i++ )
    {

        const key = preciosPorClase[i]["CLASE"];
        
        let arrayPrecios = [];
        
        for (let key in preciosPorClase[i])
        {
            if (key === "CLASE") continue;
            const valorPrecio = preciosPorClase[i][key];
            arrayPrecios.push(valorPrecio);

        }
        
        schema[key] = arrayPrecios;

    }

    return schema;


};

exports.TransformarResultadosCoche = async (resultadosCoches, preciosPorClase, formulario ) =>
{

    const diasEntreRecogidaDevolucion = await DiferenciaFechaRecogidaDevolucion(formulario);

    if (diasEntreRecogidaDevolucion === undefined)
    {
        return [undefined, "Fecha Recogida Incorrecta"];
    }

    if (diasEntreRecogidaDevolucion === 0)
    {
        console.error("SEPARACION DE DIAS ES MENOR A 1 DIA");
        return [undefined, "Separacion de dias menor a 1 dia"];
    }

    for (let i = 0; i < resultadosCoches.length; i++) {
        
        const edadChoferFormulario = resultadosCoches[i].edadChofer - 0;
        //comprobar si tiene la experiencia/edad minima
        if (edadChoferFormulario >= 23 && formulario.conductor_con_experiencia === "off")
        {
            continue;
        }

        //comprobar los dias de reserva, si es mayor a 7 dias, aplicar PRECIOMAS7 * DIAS
        const claseVehiculo = resultadosCoches[i].clasevehiculo;

        //si no existe la clase
        if (!preciosPorClase[claseVehiculo])
        {
            console.error(`resultadoscoche ${resultadosCoches[i]} clasevehiculo ${clasevehiculo}`);
            continue;
        }

        const listadoPrecios = preciosPorClase[claseVehiculo];

        const precioDiaPorClase = listadoPrecios[diasEntreRecogidaDevolucion - 1];
        const precioTotalDias = precioDiaPorClase * diasEntreRecogidaDevolucion;
        resultadosCoches[i]["preciototaldias"] = precioTotalDias;
        resultadosCoches[i]["preciopordia"] = precioDiaPorClase;

    }

    return [resultadosCoches, "", diasEntreRecogidaDevolucion];


};

const DiferenciaFechaRecogidaDevolucion = async (formulario) =>
{
    const fechaRecogida = await ObtenerConversionFecha(formulario.fechaRecogida, formulario.horaRecogida);

    if (fechaRecogida === undefined) {
        //TODO: mejorar con un redirect etc
        console.error("schema invalido")
        return undefined;
    }

    const fechaDevolucion = await ObtenerConversionFecha(formulario.fechaDevolucion, formulario.horaDevolucion);

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

    console.log("diasetre" + diasEntreRecogidaDevolucion);

    return diasEntreRecogidaDevolucion;
};


const ObtenerConversionFecha = async (fechaRaw, horaRaw) => {


    const fechaRecogidaFormSplitted = fechaRaw.split(",")[1].split("-");
    const anyo = fechaRecogidaFormSplitted[2] - 0;
    const mes = fechaRecogidaFormSplitted[1] - 0;
    const dia = fechaRecogidaFormSplitted[0] - 0;

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

    //comprobar que el tick marcado concuerde con la edad y la experiencia



    const textoFecha = `${anyo}-${mes}-${dia} ${horaRaw}:00Z`;
    const fechaRecogida = new Date(`${anyo}-${mes}-${dia} ${horaRaw}:00Z`);
    // const fechaRecogida = new Date('2011-04-11T10:20:30Z');

    return fechaRecogida;


};
