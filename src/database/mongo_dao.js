const { MongoClient } = require("mongodb");
// const { CustomExceptions } = require("../errors/Exceptions");

const client = new MongoClient(process.env.MONGO_DB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

let collectionCars = null;

async function conectDb() {
    try {
        const connect = await client.connect();
        const currentDb = client.db(process.env.MONGO_DB_NAME);

        collectionCars = currentDb.collection(process.env.MONGO_COLECCION_CARS);
        console.log(`[process ${process.pid}] CONNECTED TO DB`);
    }
    catch (err) {
        console.error(err);
        // throw new CustomExceptions("no posible conexion a la base de datos");
        //TODO: enviar a la db Redis para recoger los errores.
    }

}

/**
 * Devuelve listado de resultados por fecha
 * @param {Array} fecha
 * @returns {null|Array} nulo o listado de resultados
 */

const GetCarsByReservado = async (taken) =>
{

    try {
        let resultados = await collectionCars.find(
            {
                "reservado": taken
            }
        )
        .project({ _id: 0 })
        .toArray();

        if (resultados !== undefined)
        {
            return resultados;
        }
        else
        {
            return null;
        }

    }
    catch (err) {
        //TODO: enviar a otra db error
        console.error(err);
        // throw new CustomExceptions("no posible conexion con la db")
    }


}

module.exports = {
    conectDb,
    GetCarsByReservado
}