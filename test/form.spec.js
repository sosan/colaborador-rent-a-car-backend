const fetch = require("node-fetch");

const logicPostForm = require("../src/logicinterface/logic_postFormIndex");
const formIndex = require("../src/controllers/postFormIndex");
const index = require("../src/controllers/showIndex");

const formularioOk = {
    "token": 'eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.hZnl5amPk_I3tb4O-Otci_5XZdVWhPlFyVRvcqSwnDo_srcysDvhhKOD01DigPK1lJvTSTolyUgKGtpLqMfRDXQlekRsF4XhAjYZTmcynf-C-6wO5EI4wYewLNKFGGJzHAknMgotJFjDi_NCVSjHsW3a10nTao1lB82FRS305T226Q0VqNVJVWhE4G0JQvi2TssRtCxYTqzXVt22iDKkXeZJARZ1paXHGV5Kd1CljcZtkNZYIGcwnj65gvuCwohbkIxAnhZMJXCLaVvHqv9l-AAUV7esZvkQR1IpwBAiDQJh4qxPjFGylyXrHMqh5NlT_pWL2ZoULWTg_TJjMO9TuQ',
    "fechaRecogida": "Juv,08-04-2021",
    "horaRecogida": "09:00",
    "fechaDevolucion": "Juv,08-04-2021",
    "horaDevolucion": "20:00",
    "conductor_con_experiencia": "on",
    "edad_conductor": "22"
};


const URI_API = "http://localhost:3000/api";

test("get /api", async () => {

    const expected = "SERVER RUNNING";
    const response = await fetch(URI_API, {
        method: "GET",
        headers: {
            "Content-type": "application/json"
        }
    });
    const result = await response.json();

    expect(expected).toBe(result.message);

});

test("post /api", async () => {

    const expected = true;
    const response = await fetch(URI_API, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(formularioOk)
    });
    const json = await response.json();
    const result = json.isOk;
    expect(expected).toBe(result);

});


