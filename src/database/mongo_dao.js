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
 * Devuelve listado de resultados por categoria
 * @param {Array} categoria
 * @returns {null|Array} nulo o listado de resultados
 */
async function GetCarsByCategoria(categoria) {

    try {
        let cursorResultados = await collectionProductos.find(
            {
                "categoria": categoria
            },
            {
                projection: {
                    "_id": false,
                    "orden": false,
                    "fechaDescuento": false,
                    "fecharegistro": false
                }
            }
        ).sort({
            "fechaDescuento": -1
        }).toArray();

        if (typeof cursorResultados != "undefined") {
            if (cursorResultados.length > 0) {
                return cursorResultados;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }

    }
    catch (err) {
        console.log(err);
        throw new CustomExceptions("no posible conexion con la db")
        //TODO: enviar a otra db error
    }


}

module.exports = {
    conectDb,
    GetProductosByCategoria: GetCarsByCategoria
}