const { MongoClient } = require("mongodb");
const { EnumTiposErrores } = require("../errors/exceptions");

const client = new MongoClient(process.env.MONGO_DB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        

    });

let collectionCars = undefined;
let collectionPrecios = undefined;
let collectionHelper = undefined;
const EDAD_MINIMO_FORMULARIO = 26;
const EDAD_MAXIMA_FORMULARIO = 69;

exports.conectDb = async () => {
    try {
        const connect = await client.connect();
        const currentDb = client.db(process.env.MONGO_DB_NAME);

        collectionCars = currentDb.collection(process.env.MONGO_COLECCION_CARS);
        collectionPrecios = currentDb.collection(process.env.MONGO_COLECCION_PRECIOS);
        collectionHelper = currentDb.collection(process.env.MONGO_COLECCION_HELPER);
        console.log(`[process ${process.pid}] CONNECTED TO DB`);
    }
    catch (err) {
        console.error(err);
        // throw new CustomExceptions("no posible conexion a la base de datos");
        //TODO: enviar a la db Redis para recoger los errores.
    }

};

/**
 * Devuelve listado de resultados por fecha
 * @param {Array} fecha
 * @returns {null|Array} nulo o listado de resultados
 */

exports.GetCarsByReservado = async (taken, edadChofer) =>
{

    try {

        //filtrar por checked del formulario
        // const cochesBuscar = GenerarParametros(edadChofer);
        
        const resultados = await collectionCars.find({ "reservado": taken })
        .project({ _id: 0 })
        .toArray();
        
        if (resultados !== undefined)
        {
            return {isOk: true, resultados: resultados, errores: ""}
        }
        else
        {
            const error = `${EnumTiposErrores.SinDatos} Coleccion Cars`;
            console.error(error);
            return { isOk: false, resultados: undefined, errores: error };
        }

    }
    catch (err) {
        //TODO: enviar a otra db error, redis
        const error = `${err} Coleccion Cars`;
        console.error(error);

    }


};

const GenerarParametros = async (edadChofer) =>
{

    if (edadChofer === "on") {
        return {
            "reservado": taken,
            "edadChofer": { $lte: EDAD_MAXIMA_FORMULARIO }
        };
    }
    else {
        return {
            "reservado": taken,
            "edadChofer": { $lt: EDAD_MINIMO_FORMULARIO }
        };
    }

};

exports.GetTiposClases = async () =>
{
    try
    {
        const tiposClases = await collectionHelper.find(
            {
                "id": "clases"
            }
        )
        .project({ _id: 0 })
        .toArray();
        
        if (tiposClases !== undefined)
        {
            return { isOk: true, resultados: tiposClases[0].clases, errores: "" };
        }
        else
        {
            const error = `${EnumTiposErrores.SinDatos} Coleccion Tipos Clases`;
            console.error(error);
            return { isOk: false, resultados: undefined, errores: error };
        }

    }
    catch(error)
    {
        console.error(error);
    }
};

exports.GetPreciosPorClase = async (tiposClases) =>
{
    try {
        
        const resultados = await collectionPrecios.find(
            {
                "CLASE": { $in: tiposClases }
            }
        ).project({_id: 0}).toArray();

        if (resultados !== undefined) {
            return { isOk: true, resultados: resultados, errores: "" };
        }
        else {
            const error = `${EnumTiposErrores.SinDatos} Coleccion Precios`;
            console.error(error);
            return { isOk: false, resultados: undefined, errores: error };
        }

    }
    catch(error)
    {
        console.error(error);
    }

};

// module.exports = {
//     conectDb,
//     GetCarsByReservado,
//     GetPreciosPorClase
// }