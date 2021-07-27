const cochesPreciosRaw = await GetCarsByReservado(formulario);

const masValorados = await GetMasValorados();

const porcentajeVehiculo = await GetPorcentajeVehiculos();

const resultadosObjetoCoches = await TransformarResultadosCoche(
    cochesPreciosRaw.resultados,
    cochesPreciosRaw.preciosPorClase,
    formulario,
    cochesPreciosRaw.datosSuplementoGenerico.resultados,
    cochesPreciosRaw.datosSuplementoTipoChofer.resultados,
    masValorados,
    porcentajeVehiculo,
    true,
    token
);


const resultadoscochesChecked = await CheckResultadosCoches(
    resultadosCoches,
    preciosPorClase,
    formulario,
    suplementoGenerico,
    suplementoTipoChofer,
    masValorados,
    porcentajeTipoVehiculo,
    numeroDiasRecogidaDevolucion
);



const CheckResultadosCoches = async (
    resultadosCoches,
    preciosPorClase,
    formulario,
    suplementoGenerico,
    suplementoTipoChofer,
    masValorados,
    porcentajeTipoVehiculo,
    numeroDiasRecogidaDevolucion
) => {

    for (let i = 0; i < resultadosCoches.length; i++) {

        //comprobar los dias de reserva, si es mayor a 7 dias, aplicar PRECIOMAS7 * DIAS
        const claseVehiculo = resultadosCoches[i].clasevehiculo;
        const porcentaje = porcentajeTipoVehiculo[claseVehiculo];

        //si no existe la clase
        if (!preciosPorClase[claseVehiculo]) {
            console.error(`resultadoscoche ${resultadosCoches[i]} clasevehiculo ${claseVehiculo}`);
            continue;
        }

        const listadoPrecios = preciosPorClase[claseVehiculo];

        let precioDiaPorClase = 0;
        let precioTotalDias = 0;
        let precioDiaSinDescuento = listadoPrecios[1];

        if (numeroDiasRecogidaDevolucion > 7) {
            precioDiaPorClase = listadoPrecios[listadoPrecios.length - 1];
            precioTotalDias = precioDiaPorClase * numeroDiasRecogidaDevolucion;

        }
        else {
            precioDiaPorClase = listadoPrecios[1];
            precioTotalDias = listadoPrecios[numeroDiasRecogidaDevolucion];

        }


        resultadosCoches[i]["preciototaldias"] = precioTotalDias;

        const preciosSuplementoPorTipoChofer = await GenerarSuplementosPorTipoChofer(
            suplementoTipoChofer,
            formulario.conductor_con_experiencia,
            claseVehiculo
        );



        resultadosCoches[i]["preciopordia"] = precioDiaPorClase;
        resultadosCoches[i]["preciopordiasindescuento"] = precioDiaSinDescuento;
        resultadosCoches[i]["preciototalsindescuento"] = precioDiaSinDescuento * numeroDiasRecogidaDevolucion;
        resultadosCoches[i]["porcentaje"] = porcentaje;

        resultadosCoches[i]["preciosSuplementoPorTipoChofer"] = preciosSuplementoPorTipoChofer;

        const isValorado = await CheckIsMasValorado(resultadosCoches[i]["vehiculo"], masValorados);
        resultadosCoches[i]["masvalorado"] = isValorado;

        const suplementosGenericos = await GenerarSuplementosVehiculos(
            resultadosCoches[i].suplemento,
            suplementoGenerico
        );

        resultadosCoches[i]["suplementosgenericos"] = suplementosGenericos;

    }

    return resultadosCoches;

};