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
        //TODO: mejorar
        res.send({ "data": "" });
        console.error("schema invalido")
        return;
    }

    // de momento solo pilla los que estan libres, faltaria buscar por poblacion, localidad
    const resultadosCoches = await dbInterfaces.GetCarsByReservado(req.body);
    const preciosPorClase = await dbInterfaces.GetPreciosPorClase();
    
    if (resultadosCoches !== undefined) {
        
        for (let i = 0; i < resultadosCoches.length; i++)
        {

            const fechaRecogidaFormSplitted = req.body.fechaRecogida.split(",")[1].split("-");
            const anyo = fechaRecogidaFormSplitted[2];
            const mes = fechaRecogidaFormSplitted[1];
            const dia = fechaRecogidaFormSplitted[0];
            const textoFecha = `${anyo}-${mes}-${dia}T${req.body.horaRecogida}:00Z`;
            const fechaRecogida = new Date('2011-04-11T10:20:30Z')
            // req.body.fechaRecogida.split("-");
            //comprobar los dias de reserva, si es mayor a 7 dias, aplicar PRECIOMAS7 * DIAS
            const fecha = req.body.fechaRecogida;

            const claseVehiculo = resultadosCoches[i].clasevehiculo;
            const listadoPrecios = preciosPorClase[claseVehiculo];


         

        }

        return res.send({ "data": resultadosCoches });
    }
    else {
        return res.send({ "data": "No hay productos" });
    }
    

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