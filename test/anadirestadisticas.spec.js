require('dotenv').config();
const { MongoClient } = require("mongodb");
const fetch = require("node-fetch");
const logic_interface_stats = require("../src/logicinterface/logic_stats");
const dbInterfaces = require("../src/database/dbInterfaces");


const URI_STATS_BACKEND = `${process.env.URL_BASE}:${process.env.PORT_BACKEND}${process.env.ENDPOINT_STATS_BACKEND}`;

describe("Check estadisticas =>", () => {

    test("Conexion Mongo => post añadir stats function", async () => {

        const formulario = {
            token: "eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.hZnl5amPk_I3tb4O-Otci_5XZdVWhPlFyVRvcqSwnDo_srcysDvhhKOD01DigPK1lJvTSTolyUgKGtpLqMfRDXQlekRsF4XhAjYZTmcynf-C-6wO5EI4wYewLNKFGGJzHAknMgotJFjDi_NCVSjHsW3a10nTao1lB82FRS305T226Q0VqNVJVWhE4G0JQvi2TssRtCxYTqzXVt22iDKkXeZJARZ1paXHGV5Kd1CljcZtkNZYIGcwnj65gvuCwohbkIxAnhZMJXCLaVvHqv9l-AAUV7esZvkQR1IpwBAiDQJh4qxPjFGylyXrHMqh5NlT_pWL2ZoULWTg_TJjMO9TuQ",
            useragent: {
                isYaBrowser: false,
                isAuthoritative: true,
                isMobile: false,
                isMobileNative: false,
                isTablet: false,
                isiPad: false,
                isiPod: false,
                isiPhone: false,
                isiPhoneNative: false,
                isAndroid: false,
                isAndroidNative: false,
                isBlackberry: false,
                isOpera: false,
                isIE: false,
                isEdge: false,
                isIECompatibilityMode: false,
                isSafari: false,
                isFirefox: false,
                isWebkit: false,
                isChrome: true,
                isKonqueror: false,
                isOmniWeb: false,
                isSeaMonkey: false,
                isFlock: false,
                isAmaya: false,
                isPhantomJS: false,
                isEpiphany: false,
                isDesktop: true,
                isWindows: false,
                isLinux: true,
                isLinux64: true,
                isMac: false,
                isChromeOS: false,
                isBada: false,
                isSamsung: false,
                isRaspberry: false,
                isBot: false,
                isCurl: false,
                isAndroidTablet: false,
                isWinJs: false,
                isKindleFire: false,
                isSilk: false,
                isCaptive: false,
                isSmartTV: false,
                isUC: false,
                isFacebook: false,
                isAlamoFire: false,
                isElectron: false,
                silkAccelerated: false,
                browser: "Chrome",
                version: "90.0.4430.93",
                os: "Linux 64",
                platform: "Linux",
                geoIp: {
                },
                source: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
                isWechat: false,
            },
            location: {
                timezone: "",
                agent: {
                    isBot: false,
                },
                ip: "::1",
            },
            id: "RrJujTdmJCPf98sH7IryI",
        };

        const expected = true;

        const recieved = await InsertarPosibleComprador(formulario);
        expect(recieved).toBe(expected);

    });

});



InsertarPosibleComprador = async (comprador) => {

    try {


        const client = new MongoClient(process.env.MONGO_DB_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,


            });


        const connect = await client.connect();
        let collectionPosiblesCompradores = undefined;
        if (connect.isConnected() === true) {
            console.log(`[process ${process.pid}] CONNECTED TO MONGO DB`);
            const currentDb = client.db(process.env.MONGO_DB_NAME);

            collectionPosiblesCompradores = currentDb.collection(process.env.MONGO_COLECCION_POSIBLES_COMPRADORES);

        }

        const result = await collectionPosiblesCompradores.insertOne(comprador);
        const isInserted = await GenerarDataInserted(result.insertedCount);
        return isInserted;

    } catch (err) {
        //TODO: enviar a otra db error, redis
        const error = `${err} Coleccion posibles_compradores`;
        console.error(error);
    }


};

const GenerarDataInserted = async (insertedCount) => {

    if (insertedCount > 1) {
        throw new Error(`insercion duplicada en insertarposiblecomprador: ${comprador}`);
    }

    let isInserted = true;

    if (insertedCount === 0) {
        console.log(`insercion no posible en insertarposiblecomprador: ${comprador}`);
        isInserted = false;
    }

    return isInserted;

};
