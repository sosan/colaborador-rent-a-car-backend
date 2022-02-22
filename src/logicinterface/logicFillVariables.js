

exports.RellenarVariables = async () =>
{
    const dbInterfaces = require("../database/dbInterfaces");
    const logicGetReservas = require("./logicGetReservas");

    const datosVehiculos = await dbInterfaces.GetCarsByReservado({"reservado": false});
    await logicGetReservas.FillImagenesVehiculos(datosVehiculos.resultados);

    const preciosSillasBoosters = await dbInterfaces.GetPrecioBoosterSillas();
    await logicGetReservas.SetPrecioSillaBooster(preciosSillasBoosters.resultados);

};

