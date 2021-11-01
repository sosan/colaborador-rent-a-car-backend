const dbInterfaces = require("../database/dbInterfacesControlPanel");

exports.GetStats = async (req, res) =>
{

    console.log("backend");
    const hoy = new Date();
    const fechaInicio = `${hoy.getFullYear()}-${hoy.getMonth() + 1}-${hoy.getDate()}T00:00:00`;
    const fechaFin = `${hoy.getFullYear()}-${hoy.getMonth() + 1}-${hoy.getDate()}T23:59:59`;

    const statsRaw = await dbInterfaces.GetStats(fechaInicio, fechaFin);
    res.send({
        "statsRaw": statsRaw
    });



};