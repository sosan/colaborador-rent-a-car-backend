const { ResumeToken } = require('mongodb');
const mongo_dao = require('../database/mongo_dao');

/**
 * Devuelve listado de resultados por fecha
 * @param {Array} fecha
 * @returns {null|Array} nulo o listado de resultados
 */

const GetCarsByReservado = async (data) => {

    const resultados = await mongo_dao.GetCarsByReservado(false);
    return resultados;

};

module.exports = {
    GetCarsByReservado
}