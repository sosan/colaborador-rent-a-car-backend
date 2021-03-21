const express = require('express');
const apiSchema = require("../schemas/apischema");
const dbInterfaces = require("../database/dbInterfaces");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({ 'message': 'SERVER RUNNING' });
});


router.get("/api/all", async (req, res) => {
    const resultados = await dbInterfaces.GetCarsByReservado(req.body);

    if (resultados !== undefined) {
        return res.send({ "data": resultados });
    }
    else {
        return res.send({ "data": "No hay productos" });
    }

});

router.post("/api", async (req, res) => {

    const isSchemaValid = await ControlSchema(req.body);
    
    if (isSchemaValid === false)
    {
        //TODO: mejorar
        res.send({ "data": "" });
        console.error("schema invalido")
        return;
    }

    // de momento solo pilla los que estan libres, faltaria buscar por poblacion, localidad
    const resultados = await dbInterfaces.GetCarsByReservado(req.body);

    if (resultados !== undefined) {
        return res.send({ "data": resultados });
    }
    else {
        return res.send({ "data": "No hay productos" });
    }
    

});

const ControlSchema = async (body) =>
{

    
    for (key in body)
    {
        if (body[key] === "" || body[key] === undefined)
        {
            return false;
        }
        
        
        let schemaValid = false;
        for (let i = 0; i < apiSchema.length; i++)
        {
            if (key === apiSchema[i])
            {
                schemaValid = true;
                break;
            }
        }

        if (schemaValid === false)
        {
            return false;
        }

    }

    return true;
}

module.exports = router;