const express = require('express');
const mongo_dao = require('../database/mongo_dao');
const { CustomExceptions } = require('../errors/exceptions');

const router = express.Router();

router.get("/", (req, res) => {
    res.json({ 'message': 'SERVER RUNNING' });
});

router.post("/api", async (req, res) => {

    let categoria = req.body.categoria;
    if (typeof categoria != "undefined") {

        if (categoriasDefault.includes(categoria) === true) {
            let resultados = await mongo_dao.GetCarsByCategoria(categoria);
            if (resultados != null) {
                res.send({ "data": resultados });
            }
            else {
                res.send({ "data": "No hay productos" });
            }


        }
        else {
            res.send({
                "data": "categoria no existe"
            });
            throw new CustomExceptions("no existe categoria");
            //TODO: pasarlo a una db para pillar ip etc

        }

    }
    else {
        res.send({
            "data": "No existe categoria"
        }).status;
    }
});


module.exports = router;