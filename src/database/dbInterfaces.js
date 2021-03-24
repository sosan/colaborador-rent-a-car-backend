const { ResumeToken } = require('mongodb');
const mongo_dao = require('../database/mongo_dao');

/**
 * Devuelve listado de resultados por fecha
 * @param {Array} fecha
 * @returns {null|Array} nulo o listado de resultados
 */

exports.GetCarsByReservado = async (data) => {

    const resultados = await mongo_dao.GetCarsByReservado(false);
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

    const transformadosPreciosPorClase = TransformarPreciosPorClase(preciosPorClase);

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




// module.exports = {
//     GetCarsByReservado,
//     GetPreciosPorClase
// }