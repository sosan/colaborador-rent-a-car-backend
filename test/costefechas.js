require('dotenv').config();

const logicInterface = require("../src/logicinterface/logic_postFormIndex");


describe("Coste fecha recogida y fecha devolucion segun temporadas", () => {

    test("coste temporada", async () => {

        const formulario = {
            token: "sdj&/k.(fk)j#.#$d.a#s%djf.l7).as!#%as/kue#$!.!.#.$!.#$",
            direct: false,
            conductor_con_experiencia: "on",
            edad_conductor: "22",
            idioma: "es",
            success: "CWnlKBq9IMLQfjt15KG4z",
            anyos_carnet: "2",
            fase: "2",
            fechaRecogida: "2022-02-15T09:00:00.000Z",
            horaRecogida: "09:00",
            fechaDevolucion: "2022-04-01T20:00:00.000Z",
            horaDevolucion: "20:00",
            numeroDias: 46,
            fechaRecogidaFormatoCorto: "15-2-2022",
            fechaDevolucionFormatoCorto: "1-4-2022",
        };

        const cochesConPrecio = logicInterface.GetCarsByReservadoExport(formulario);

        // expect(expected).toBe(result.message);

    });

});