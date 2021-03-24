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

    for (let i = 0; i < preciosPorClase.lenght(); i++ )
    {

        const key = preciosPorClase[i]["CLASE"];
        // const currentValues = preciosPorClase[i]["CLASE"];
        let arrayPrecios = [];
        for (let j = 0; j < preciosPorClase[i].lenght(); j++ )
        {
            arrayPrecios.push[currentValues[j]];

        }
        
        schema[key] = arrayPrecios;

    }


    const x = {
        basico: [30, 55, 80,],
        openAutomatic: [32]
    };
    /**
     * [
  {
    CLASE: "basico",
    PRECIO920: 30,
    PRECIO2: 55,
    PRECIO3: 80,
    PRECIO4: 105,
    PRECIO5: 125,
    PRECIO6: 145,
    PRECIO7: 165,
    PRECIOMAS7: 23,
  },
  {
    CLASE: "openAutomatic",
    PRECIO920: 32,
    PRECIO2: 58,
    PRECIO3: 87,
    PRECIO4: 112,
    PRECIO5: 135,
    PRECIO6: 162,
    PRECIO7: 180,
    PRECIOMAS7: 25,
  },
  {
    CLASE: "5pax",
    PRECIO920: 35,
    PRECIO2: 65,
    PRECIO3: 95,
    PRECIO4: 125,
    PRECIO5: 150,
    PRECIO6: 175,
    PRECIO7: 200,
    PRECIOMAS7: 28,
  },
  {
    CLASE: "7pax",
    PRECIO920: 50,
    PRECIO2: 95,
    PRECIO3: 130,
    PRECIO4: 170,
    PRECIO5: 210,
    PRECIO6: 240,
    PRECIO7: 270,
    PRECIOMAS7: 38,
  },
  {
    CLASE: "motos1",
    PRECIO920: 30,
    PRECIO2: 55,
    PRECIO3: 80,
    PRECIO4: 105,
    PRECIO5: 125,
    PRECIO6: 145,
    PRECIO7: 165,
    PRECIOMAS7: 0,
  },
  {
    CLASE: "motos2",
    PRECIO920: 32,
    PRECIO2: 58,
    PRECIO3: 87,
    PRECIO4: 112,
    PRECIO5: 135,
    PRECIO6: 162,
    PRECIO7: 180,
    PRECIOMAS7: 0,
  },
]
     *
     *
     */



};




// module.exports = {
//     GetCarsByReservado,
//     GetPreciosPorClase
// }