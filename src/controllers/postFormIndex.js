const logicInterface = require("../logicinterface/logic_postFormIndex");


exports.GetAllVehicles = async (req, res) =>
{
    
    if (req.body.token !== process.env.TOKEN_FOR_BACKEND_CHECK)
    {
        const [respuesta, formulario] = await logicInterface.CheckTokenFromGetAllVehicles(req.body);
        if (respuesta.isTokenValid === false) {
            console.error("token invalido");
            return res.send({ "isOk": false });
        }
    
        if (respuesta.isSchemaValid === false) {
            console.error("Esquema invalido");
            return res.send({ "isOk": false, "errorFormulario": "" });
        }
        
        const resultados = await logicInterface.GetAllCars(formulario);
        resultados["token"] = `sdj&/k.(fk)j#.#$d.a#s%djf.l7).as!#%as/kue#$!.!.#.$!.#$`;
        return res.send(resultados);
    }
    else
    {

        let formulario = {
            token: "sdj&/k.(fk)j#.#$d.a#s%djf.l7).as!#%as/kue#$!.!.#.$!.#$",
            direct: false,
            id: "OWVE7jeox607QBXf4oL5h",
            conductor_con_experiencia: "off",
        };

        const resultados = await logicInterface.GetAllCars(formulario);
        resultados["token"] = `sdj&/k.(fk)j#.#$d.a#s%djf.l7).as!#%as/kue#$!.!.#.$!.#$`;
        return res.send(resultados);

    }

    
    
};


exports.GetCarsFromCard = async (req, res) =>
{
    
    const [respuesta, formulario] = await logicInterface.CheckTokenPostForm(req.body);
    if (respuesta.isTokenValid === false) {
        console.error("token invalido");
        return res.send({ "isOk": false });
    }
    
    if (respuesta.isSchemaValid === false) {
        console.error("Esquema invalido");
        return res.send({ "isOk": false, "errorFormulario": "" });
    }
    
    const resultados = await logicInterface.GetCars(formulario);
    resultados["token"] = `sdj&/k.(fk)j#.#$d.a#s%djf.l7).as!#%as/kue#$!.!.#.$!.#$`;
    return res.send(resultados);

};




exports.postFormIndex = async (req, res) =>
{

    if (req.body.token !== process.env.TOKEN_FOR_BACKEND_CHECK)
    {
        // chequeos
        const [respuesta, formulario] = await logicInterface.CheckTokenPostForm(req.body);
        if (respuesta.isTokenValid === false)
        {
            console.error("token invalido");
            return res.send({ "isOk": false });
        }
    
        if (respuesta.isSchemaValid === false)
        {
            console.error("Esquema invalido");
            return res.send({ "isOk": false, "errorFormulario": "" });
        }
    
        let resultados = await logicInterface.GetCars(formulario);
        
        return res.send(resultados);

    }
    else
    {
        // const resultados = await logicInterface.GetCars(req.body.formulario, req.body.token);

        const cochesPreciosRaw = await  logicInterface.GetCarsByReservadoExport(req.body.formulario);
        const masValorados = await logicInterface.GetMasValoradosExport();
        const porcentaje = await logicInterface.GetPorcentajeVehiculosExport();

        return res.send({
            "isOk": true,
            "cochesPreciosRaw": cochesPreciosRaw,
            "masValorados": masValorados,
            "porcentaje": porcentaje
        });
    }

    

};







