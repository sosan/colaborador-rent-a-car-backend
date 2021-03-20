const { MongoClient } = require("mongodb");
// const { CustomExceptions } = require("../errors/Exceptions");

const client = new MongoClient(process.env.MONGO_DB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

let collectionProductos = null;

async function conectDb() {
    try {
        const connect = await client.connect();
        const currentDb = client.db(process.env.MONGO_DB_NAME);

        collectionProductos = currentDb.collection(process.env.MONGO_COLECCION_CARS);
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

const GetCarsByTaken = async (taken) =>
{

    try {
        let cursorResultados = await collectionProductos.find(
            {
                "ocupado": taken
            }
        )
        .project({ _id: 0 })
        .toArray();

        if (cursorResultados !== undefined)
        {
            return cursorResultados;
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
    GetCarsByTaken
}