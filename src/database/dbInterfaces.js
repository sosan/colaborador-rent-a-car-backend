const { ResumeToken } = require('mongodb');
const mongo_dao = require('../database/mongo_dao');

/**
 * Devuelve listado de resultados por fecha
 * @param {Array} fecha
 * @returns {null|Array} nulo o listado de resultados
 */

const GetCarsByTaken = async (data) => {

    const resultados = await mongo_dao.GetCarsByTaken(false);
    return resultados;

};

module.exports = {
    GetCarsByTaken
}