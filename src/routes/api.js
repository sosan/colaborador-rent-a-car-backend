const express = require('express');
const apiSchema = require("../schemas/apischema");
const dbInterfaces = require("../database/dbInterfaces");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({ 'message': 'SERVER RUNNING' });
});


router.post("/api", async (req, res) => {

    const isSchemaValid = await ControlSchema(req.body);
    
    if (isSchemaValid === false)
    {
        //TODO: mejorar a redireccion
        res.send({ "data": "" });
        console.error("schema invalido")
        return;
    }

    // de momento solo pilla los que estan libres, faltaria buscar por poblacion, localidad
    const resultadosCochesSinPrecioCalculado = await dbInterfaces.GetCarsByReservado(req.body);
    if (resultadosCochesSinPrecioCalculado === undefined) {
        console.error("resultadosCochesSinPrecioCalculado undefined");
        return res.send({ "data": "No hay productos" });

    }
    const preciosPorClase = await dbInterfaces.GetPreciosPorClase();
    if (preciosPorClase === undefined) {
        console.error("preciosPorClase undefined");
        return res.send({ "data": "No hay productos" });
    }


    const [resultadosCoches, errorFormulario, diasEntreRecogidaDevolucion] = await dbInterfaces.TransformarResultadosCoche(resultadosCochesSinPrecioCalculado, preciosPorClase, req.body);
    if (resultadosCoches === undefined)
    {
        console.error("resultadosCoche undefined");
        return res.send({ 
            "data": [], 
            "errorFormulario": errorFormulario,
            "diasEntreRecogidaDevolucion": diasEntreRecogidaDevolucion
        });
    }

    return res.send({ 
        "data": resultadosCoches, 
        "errorFormulario": errorFormulario, 
        "diasEntreRecogidaDevolucion": diasEntreRecogidaDevolucion 
    });
    
    

});




// control de schema para comprobar que lo que envia el frontend
// cumple con el schema
const ControlSchema = async (body) => {

    const tamanyoBody = Object.keys(body).length;
    if (tamanyoBody <= 0 || tamanyoBody > apiSchema.length) return false;

    let isValid = false;
    for (key in body) {
        if (body[key] === "" || body[key] === undefined) {
            return false;
        }

        let schemaValid = isValid = false;
        for (let i = 0; i < apiSchema.length; i++) {
            if (key === apiSchema[i]) {
                schemaValid = true;
                isValid = true;
                break;
            }
        }

        //TODO: controla hora y fecha introducidas

        if (schemaValid === false) {
            return false;
        }

    }

    return isValid;
}

module.exports = router;