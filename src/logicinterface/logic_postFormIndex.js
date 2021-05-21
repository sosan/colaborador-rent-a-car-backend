const dbInterfaces = require("../database/dbInterfaces");
const { EnumTiposErrores } = require("../errors/exceptions");

const DAY_IN_MILISECONDS = 86400000;
const DIA_DATE = new Date(DAY_IN_MILISECONDS);

// TODO: generar string a partir del secreto
exports.GenerateTokenBackendToFrontend = async () =>
{

    return process.env.TOKEN_BACKEND_TO_FRONTEND_SECRET;
};



exports.GetCarsByReservado = async (formulario) => {

    const filtrado = await GenerarParametros(false, formulario.conductor_con_experiencia);
    const datosVehiculos = await dbInterfaces.GetCarsByReservado(filtrado);


    const datosOrdenacion = await dbInterfaces.GetClaseVehiculosOrdenados();
    if (datosOrdenacion.isOk === false) {
        const error = `NO hay collecion datos ordenados `;
        console.error(error);
        return { isOk: false, resultados: undefined, errores: error };
    }

    datosVehiculos["datosOrdenacion"] = datosOrdenacion;

    const allDatosSuplementoTipoChofer = await dbInterfaces.GetSuplementosTipoChofer();
    if (allDatosSuplementoTipoChofer.isOk === false) {
        const error = `| - NO hay collecion suplemento tipo chofer`;
        console.error(error);
        return { isOk: false, resultados: undefined, errores: error };
    }
    datosVehiculos["datosSuplementoTipoChofer"] = allDatosSuplementoTipoChofer;

    const datosSuplementoGenerico = await dbInterfaces.GetSuplementoGenerico();
    if (datosSuplementoGenerico.isOk === false) {
        const error = `| - NO hay collecion suplemento generico `;
        console.error(error);
        return { isOk: false, resultados: undefined, errores: error };
    }

    datosVehiculos["datosSuplementoGenerico"] = datosSuplementoGenerico;


    const tiposClases = await dbInterfaces.GetTiposClases();

    if (tiposClases.isOk === false) {
        const error = `| - NO hay collecion tiposclases `;
        console.error(error);
        return { isOk: false, resultados: undefined, errores: error };
    }

    const preciosPorClase = await dbInterfaces.GetPreciosPorClase(tiposClases.resultados);

    if (preciosPorClase.isOk === false) {
        const error = `| - NO hay collecion preciosporclase `;
        console.error(error);
        return { isOk: false, resultados: undefined, errores: error };
    }

    //TODO: mejorar estatico
    const transformadosPreciosPorClase = await TransformarPreciosPorClase(preciosPorClase.resultados);

    if (transformadosPreciosPorClase === undefined || transformadosPreciosPorClase === {}) {
        const error = `| - Transformacion no posible en preciosporclase `;
        console.error(error);
        return { isOk: false, resultados: undefined, errores: error };
    }

    datosVehiculos["preciosPorClase"] = transformadosPreciosPorClase;

    const condicionesGenerales = await dbInterfaces.GetCondicionesGenerales();
    datosVehiculos["condicionesgenerales"] = condicionesGenerales;

    const pagoRecogida = await dbInterfaces.GetPagoRecogida();
    datosVehiculos["pagoRecogida"] = pagoRecogida;

    return datosVehiculos;

};

// funcion donde genera el objeto para filtrar en la db
const GenerarParametros = async (reservado, conductor_con_experiencia) => {

    if (conductor_con_experiencia === "on") {
        return { "reservado": reservado };
    }
    else {
        return {
            "reservado": reservado,
            // "edadChofer": { $in: [EDAD_MINIMA_FORMULARIO, EDAD_MAXIMA_FORMULARIO] }
        };
    }

}

const TransformarPreciosPorClase = async (preciosPorClase) => {

    let schema = {};

    for (let i = 0; i < preciosPorClase.length; i++) {

        const key = preciosPorClase[i]["CLASE"];

        let arrayPrecios = [];

        for (let key in preciosPorClase[i]) {
            if (key === "CLASE") continue;
            const valorPrecio = preciosPorClase[i][key];
            arrayPrecios.push(valorPrecio);

        }

        schema[key] = arrayPrecios;

    }

    return schema;


};


exports.TransformarResultadosCoche = async (
    resultadosCoches, 
    preciosPorClase, 
    formulario, 
    suplementoGenerico, 
    suplementoTipoChofer,
    masValorados
) => 
{

    const diasEntreRecogidaDevolucion = await DiferenciaFechaRecogidaDevolucion(formulario);

    if (diasEntreRecogidaDevolucion === undefined) {
        return {
            isOk: false,
            resultadosCoches: undefined,
            errorFormulario: "error_formulario3",
            diasEntreRecogidaDevolucion: undefined
        };

    }

    const numeroDiasRecogidaDevolucion = diasEntreRecogidaDevolucion + 1;
    
    // let resultadosCochesTemporal = [];
    for (let i = 0; i < resultadosCoches.length; i++)
    {

        //comprobar los dias de reserva, si es mayor a 7 dias, aplicar PRECIOMAS7 * DIAS
        const claseVehiculo = resultadosCoches[i].clasevehiculo;

        //si no existe la clase
        if (!preciosPorClase[claseVehiculo])
        {
            console.error(`resultadoscoche ${resultadosCoches[i]} clasevehiculo ${claseVehiculo}`);
            continue;
        }

        const listadoPrecios = preciosPorClase[claseVehiculo];

        let precioDiaPorClase = 0;
        let precioTotalDias = 0;
        let precioDiaSinDescuento = listadoPrecios[1];
        
        if (numeroDiasRecogidaDevolucion > 7) 
        {
            precioDiaPorClase = listadoPrecios[listadoPrecios.length - 1];
            precioTotalDias = precioDiaPorClase * numeroDiasRecogidaDevolucion;
            
        }
        else 
        {
            precioDiaPorClase = listadoPrecios[1];
            precioTotalDias = listadoPrecios[numeroDiasRecogidaDevolucion];
            
        }
        
        resultadosCoches[i]["preciototaldias"] = precioTotalDias;
        resultadosCoches[i]["preciopordia"] = precioDiaPorClase;
        resultadosCoches[i]["preciopordiasindescuento"] = precioDiaSinDescuento;
        resultadosCoches[i]["preciototalsindescuento"] = precioDiaSinDescuento * numeroDiasRecogidaDevolucion;

        
        const preciosSuplementoPorTipoChofer =  await GenerarSuplementosPorTipoChofer(
            suplementoTipoChofer, 
            formulario.conductor_con_experiencia,
            claseVehiculo
        );

        resultadosCoches[i]["preciosSuplementoPorTipoChofer"] = preciosSuplementoPorTipoChofer;

        // const [suplementosGenericos, sumaSuplementosGenericos ] = await GenerarSuplementosVehiculos(
        //     resultadosCoches[i].suplemento,
        //     suplementoGenerico

        // );


        const isValorado = await CheckIsMasValorado(resultadosCoches[i]["vehiculo"], masValorados);
        resultadosCoches[i]["masvalorado"] = isValorado;

        const suplementosGenericos = await GenerarSuplementosVehiculos(
            resultadosCoches[i].suplemento,
            suplementoGenerico
        );


        resultadosCoches[i]["suplementosgenericos"] = suplementosGenericos;
        // resultadosCoches[i]["sumaSuplementosGenericos"] = sumaSuplementosGenericos;

    }
    
    return {
        isOk: true,
        resultadosCoches: resultadosCoches,
        errorFormulario: "",
        diasEntreRecogidaDevolucion: numeroDiasRecogidaDevolucion
    };


};


const GenerarSuplementosPorTipoChofer = async (
    suplementoTipoChofer, 
    conductor_con_experiencia,
    claseVehiculo
) =>
{

    let preciosSuplementoPorTipoChofer = {
        "no-oferta": [],
        "oferta": []
    };

    const currentTipoChofer = await ObtenerListadoTipoChofer(claseVehiculo, conductor_con_experiencia, suplementoTipoChofer);
    let objSuplemento = {};

    if (currentTipoChofer[claseVehiculo] > 0) 
    {
        
        // objSuplemento["descripcion"] = `Cargo Conductor Joven: ${currentTipoChofer[claseVehiculo]} € por dia.`;
        // objSuplemento["tooltip"] = `El usuario debe pagar un suplmento por conductor joven de ${currentTipoChofer[claseVehiculo]} € por dia`;
        objSuplemento["descripcion"] = "cargo_conductor_joven";
        objSuplemento["tooltip"] = "tooltip_cargo_conductor_joven";
        objSuplemento["valor"] = currentTipoChofer[claseVehiculo];
        preciosSuplementoPorTipoChofer["no-oferta"].push(objSuplemento);
        
    }
    else
    {
        
        objSuplemento["descripcion"] = "sin_cargo_conductor_joven";
        objSuplemento["tooltip"] = "tooltip_sin_cargo_conductor_joven";
        objSuplemento["valor"] = 0;
        preciosSuplementoPorTipoChofer["oferta"].push(objSuplemento);
        
    }

    return preciosSuplementoPorTipoChofer;


};


const ObtenerListadoTipoChofer = async (claseVehiculo, conductor_con_experiencia, suplementoTipoChofer) =>
{

    let currentTipoChofer = {};

    if (conductor_con_experiencia === "on")
    {
        if (claseVehiculo === "motos2")
        {
            currentTipoChofer = suplementoTipoChofer["choferPlus252Motos"];
        }
        else
        {
            currentTipoChofer = suplementoTipoChofer["choferPlus232Cars"];
        }
    }
    else
    {
        if (claseVehiculo === "motos2")
        {
            currentTipoChofer = suplementoTipoChofer["choferPlusNovelMotos"];
        }
        else
        {
            currentTipoChofer = suplementoTipoChofer["choferPlusNovelCars"];
        }

    }

    return currentTipoChofer;

};


const GenerarSuplementosVehiculos = async (suplementos, suplementoGenerico) =>
{

    let suplementosGenericos = [];

    for (let j = 0; j < suplementos.length; j++) 
    {

        const keySuplemento = suplementos[j];
        const contenidoSuplemento = suplementoGenerico[keySuplemento];
        
        if (contenidoSuplemento.valor > 0)
        {
            // let texto = contenidoSuplemento["tooltip_pagar"];
            // contenidoSuplemento["tooltip_pagar"] = texto.replace("X", contenidoSuplemento["valor"] );
            
            suplementosGenericos.push({
                "titulo": contenidoSuplemento["titulo_pagar"],
                "tooltip": contenidoSuplemento["tooltip_pagar"],
                "valor": contenidoSuplemento["valor"]
            });
        }
        else
        {
            suplementosGenericos.push({
                "titulo": contenidoSuplemento["titulo_gratis"],
                "tooltip": contenidoSuplemento["tooltip_gratis"],
                "valor": 0
            });
        }
        
    }

    return suplementosGenericos;

};

const DiferenciaFechaRecogidaDevolucion = async (formulario) => {
    const fechaRecogida = await ObtenerConversionFecha(
        formulario.fechaRecogida,
        formulario.horaRecogida,

    );

    if (fechaRecogida === undefined) {
        //TODO: mejorar con un redirect etc
        console.error("schema invalido")
        return undefined;
    }

    let fechaDevolucion = await ObtenerConversionFecha(
        formulario.fechaDevolucion,
        formulario.horaDevolucion,

    );

    if (fechaDevolucion === undefined) {
        //TODO: mejorar con un redirect etc
        console.error("schema invalido")
        return undefined;
    }

    // comprobar que fechaDevolucion es mayor a la fechaRecogida
    if (fechaDevolucion < fechaRecogida) {
        console.error("FEchaDevolucion es menor a la fechaRecogida");
        return undefined;
    }

    const milisecondsEntreRecogidaDevolucion = fechaDevolucion - fechaRecogida;
    const diasEntreRecogidaDevolucion = Math.round(milisecondsEntreRecogidaDevolucion / DAY_IN_MILISECONDS);

    console.log("dias=" + diasEntreRecogidaDevolucion);

    return diasEntreRecogidaDevolucion;
};

const ObtenerConversionFecha = async (fechaRaw, horaRaw) => {


    const fechaRecogidaFormSplitted = fechaRaw.split(",")[1].split("-");
    const anyo = fechaRecogidaFormSplitted[2] - 0;
    const mes = fechaRecogidaFormSplitted[1] - 0;
    const dia = fechaRecogidaFormSplitted[0] - 0;

    // const horaSplitted = horaRaw.split(":");
    // const hora = horaSplitted[0] - 0;


    //comprobar que el mes este entre 0 y 11, dia entre 1 y 30 y 1900-
    if (mes < 1 || mes > 12) {
        console.error("Mes - Conversion erronea");
        return undefined;
    }

    if (anyo < 1900) {
        console.error("Anyo - Conversion erronea");
        return undefined;
    }

    if (dia < 1 || dia > 31) {
        console.error("Dia - Conversion erronea");
        return undefined;
    }

    const fechaRecogida = new Date(`${anyo}-${mes}-${dia} ${horaRaw}:00Z`);

    return fechaRecogida;


};


const CheckIsMasValorado = async (vehiculo, masvalorados) =>
{

    let isValorado = false;
    for (let i = 0; i < masvalorados.length; i++)
    {

        if (vehiculo === masvalorados[i])
        {
            isValorado = true;
            break;
        }

    }

    return isValorado;

};

exports.GetMasValorados = async () =>
{

    const result = await dbInterfaces.GetMasValorados();
    return result;


};

