const logicGetReservas = require("./logicGetReservas");
const dbInterfaces = require("../database/dbInterfaces")


exports.RellenarVariables = async () =>
{
    const datosVehiculos = await dbInterfaces.GetCarsByReservado({"reservado": false});
    await logicGetReservas.FillImagenesVehiculos(datosVehiculos.resultados);


};