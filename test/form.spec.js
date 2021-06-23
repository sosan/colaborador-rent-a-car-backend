require('dotenv').config();
const { asyncFetchGet } = require("./fetches");
const { asyncFetchPost } = require("./fetches");


const logicPostForm = require("../src/logicinterface/logic_postFormIndex");
const formIndex = require("../src/controllers/postFormIndex");
const index = require("../src/controllers/showIndex");


const formularioBase = {
    token: "eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.hZnl5amPk_I3tb4O-Otci_5XZdVWhPlFyVRvcqSwnDo_srcysDvhhKOD01DigPK1lJvTSTolyUgKGtpLqMfRDXQlekRsF4XhAjYZTmcynf-C-6wO5EI4wYewLNKFGGJzHAknMgotJFjDi_NCVSjHsW3a10nTao1lB82FRS305T226Q0VqNVJVWhE4G0JQvi2TssRtCxYTqzXVt22iDKkXeZJARZ1paXHGV5Kd1CljcZtkNZYIGcwnj65gvuCwohbkIxAnhZMJXCLaVvHqv9l-AAUV7esZvkQR1IpwBAiDQJh4qxPjFGylyXrHMqh5NlT_pWL2ZoULWTg_TJjMO9TuQ",
    success: "iMxriCTRwrfPalla6zCxw",
    fase: "1",
    fechaRecogida: "Sáb,08-05-2021",
    horaRecogida: "09:00",
    fechaDevolucion: "Sáb,08-05-2021",
    horaDevolucion: "20:00",
    conductor_con_experiencia: "on",
    edad_conductor: "22",
};


const URI_API_BACKEND = `${process.env.URL_BASE}:${process.env.PORT_BACKEND}${process.env.ENDPOINT_API_BACKEND}`;




describe("Check /api", () => 
{

    test("get /api", async () => {

        const expected = "SERVER RUNNING";
        const result = await asyncFetchGet("http://localhost:3000/api");

        expect(expected).toBe(result.message);

    });

});

test("post token mal formulario /api", async () => {

    const expected = false;

    const formulario = {
        token: "tokenmal",
        success: "iMxriCTRwrfPalla6zCxw",
        fase: "1",
        fechaRecogida: "Sáb,08-05-2021",
        horaRecogida: "09:00",
        fechaDevolucion: "Sáb,08-05-2021",
        horaDevolucion: "20:00",
        conductor_con_experiencia: "on",
        edad_conductor: "22",
    };

    
    const response = await asyncFetchPost(URI_API_BACKEND, formulario);
    const recieved = response.isOk;
    expect(recieved).toBe(expected);

});

test("post bien formulario /api", async () => {

    const expected = true;

    const formulario = {
        token: "eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.hZnl5amPk_I3tb4O-Otci_5XZdVWhPlFyVRvcqSwnDo_srcysDvhhKOD01DigPK1lJvTSTolyUgKGtpLqMfRDXQlekRsF4XhAjYZTmcynf-C-6wO5EI4wYewLNKFGGJzHAknMgotJFjDi_NCVSjHsW3a10nTao1lB82FRS305T226Q0VqNVJVWhE4G0JQvi2TssRtCxYTqzXVt22iDKkXeZJARZ1paXHGV5Kd1CljcZtkNZYIGcwnj65gvuCwohbkIxAnhZMJXCLaVvHqv9l-AAUV7esZvkQR1IpwBAiDQJh4qxPjFGylyXrHMqh5NlT_pWL2ZoULWTg_TJjMO9TuQ",
        success: "iMxriCTRwrfPalla6zCxw",
        fase: "1",
        fechaRecogida: "Sáb,08-05-2021",
        horaRecogida: "09:00",
        fechaDevolucion: "Sáb,08-05-2021",
        horaDevolucion: "20:00",
        conductor_con_experiencia: "on",
        edad_conductor: "22",
    };

    const response = await asyncFetchPost(URI_API_BACKEND, formulario);
    const recieved = response.isOk;
    expect(recieved).toBe(expected);

});

test("post edad conductor mal formulario /api", async () => {

    const expected = false;

    const formulario = {
        token: "eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.hZnl5amPk_I3tb4O-Otci_5XZdVWhPlFyVRvcqSwnDo_srcysDvhhKOD01DigPK1lJvTSTolyUgKGtpLqMfRDXQlekRsF4XhAjYZTmcynf-C-6wO5EI4wYewLNKFGGJzHAknMgotJFjDi_NCVSjHsW3a10nTao1lB82FRS305T226Q0VqNVJVWhE4G0JQvi2TssRtCxYTqzXVt22iDKkXeZJARZ1paXHGV5Kd1CljcZtkNZYIGcwnj65gvuCwohbkIxAnhZMJXCLaVvHqv9l-AAUV7esZvkQR1IpwBAiDQJh4qxPjFGylyXrHMqh5NlT_pWL2ZoULWTg_TJjMO9TuQ",
        success: "iMxriCTRwrfPalla6zCxw",
        fase: "1",
        fechaRecogida: "Sáb,08-05-2021",
        horaRecogida: "09:00",
        fechaDevolucion: "Sáb,08-05-2021",
        horaDevolucion: "20:00",
        conductor_con_experiencia: "on",
        edad_conductor: "oooooo"
    };

    const response = await asyncFetchPost(URI_API_BACKEND, formulario);
    const recieved = response.isOk;
    expect(recieved).toBe(expected);

});

test("post fase/edad_conductor mal formulario /api", async () => {

    const expected = false;

    const formulario = {
        token: "eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.hZnl5amPk_I3tb4O-Otci_5XZdVWhPlFyVRvcqSwnDo_srcysDvhhKOD01DigPK1lJvTSTolyUgKGtpLqMfRDXQlekRsF4XhAjYZTmcynf-C-6wO5EI4wYewLNKFGGJzHAknMgotJFjDi_NCVSjHsW3a10nTao1lB82FRS305T226Q0VqNVJVWhE4G0JQvi2TssRtCxYTqzXVt22iDKkXeZJARZ1paXHGV5Kd1CljcZtkNZYIGcwnj65gvuCwohbkIxAnhZMJXCLaVvHqv9l-AAUV7esZvkQR1IpwBAiDQJh4qxPjFGylyXrHMqh5NlT_pWL2ZoULWTg_TJjMO9TuQ",
        success: "iMxriCTRwrfPalla6zCxw",
        fase: "dskdfs",
        fechaRecogida: "Sáb,08-05-2021",
        horaRecogida: "09:00",
        fechaDevolucion: "Sáb,08-05-2021",
        horaDevolucion: "20:00",
        conductor_con_experiencia: "on",
        edad_conductor: "oooooo"
    };

    const response = await asyncFetchPost(URI_API_BACKEND, formulario);
    const recieved = response.isOk;
    expect(recieved).toBe(expected);

});



// realizar test variable conductor
