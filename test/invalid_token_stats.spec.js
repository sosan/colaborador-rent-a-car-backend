require('dotenv').config();
const fetch = require("node-fetch");


const URI_STATS_BACKEND = `${process.env.URL_BASE}:${process.env.PORT_BACKEND}${process.env.ENDPOINT_STATS_BACKEND}`;


const data =
{
    "token": "eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.hZnl5amPk_I3tb4O-Otci_5XZdVWhPlFyVRvcqSwnDo_srcysDvhhKOD01DigPK1lJvTSTolyUgKGtpLqMfRDXQlekRsF4XhAjYZTmcynf-C-6wO5EI4wYewLNKFGGJzHAknMgotJFjDi_NCVSjHsW3a10nTao1lB82FRS305T226Q0VqNVJVWhE4G0JQvi2TssRtCxYTqzXVt22iDKkXeZJARZ1paXHGV5Kd1CljcZtkNZYIGcwnj65gvuCwohbkIxAnhZMJXCLaVvHqv9l-AAUV7esZvkQR1IpwBAiDQJh4qxPjFGylyXrHMqh5NlT_pWL2ZoULWTg_TJjMO9TuQ",
    "useragent": {
        "isYaBrowser": false,
        "isAuthoritative": true,
        "isMobile": false,
        "isMobileNative": false,
        "isTablet": false,
        "isiPad": false,
        "isiPod": false,
        "isiPhone": false,
        "isiPhoneNative": false,
        "isAndroid": false,
        "isAndroidNative": false,
        "isBlackberry": false,
        "isOpera": false,
        "isIE": false,
        "isEdge": false,
        "isIECompatibilityMode": false,
        "isSafari": false,
        "isFirefox": false,
        "isWebkit": false,
        "isChrome": true,
        "isKonqueror": false,
        "isOmniWeb": false,
        "isSeaMonkey": false,
        "isFlock": false,
        "isAmaya": false,
        "isPhantomJS": false,
        "isEpiphany": false,
        "isDesktop": true,
        "isWindows": false,
        "isLinux": true,
        "isLinux64": true,
        "isMac": false,
        "isChromeOS": false,
        "isBada": false,
        "isSamsung": false,
        "isRaspberry": false,
        "isBot": false,
        "isCurl": false,
        "isAndroidTablet": false,
        "isWinJs": false,
        "isKindleFire": false,
        "isSilk": false,
        "isCaptive": false,
        "isSmartTV": false,
        "isUC": false,
        "isFacebook": false,
        "isAlamoFire": false,
        "isElectron": false,
        "silkAccelerated": false,
        "browser": "Chrome",
        "version": "90.0.4430.93",
        "os": "Linux 64",
        "platform": "Linux",
        "geoIp": {},
        "source": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
        "isWechat": false,
    },
    "location": {
        "timezone": "",
        "agent": {
            "isBot": false,
        },
        "ip": "::1",
    },
    "id": "-T4bTh6O2N_RRBSS6nH9f",
};


test("post añadir stats token incorrecto /7HNH9bkz57LHwa_framLQ", async () => {

    const expected = false;
    data["token"] = "token incorrecto";
    const response = await fetch(URI_STATS_BACKEND, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
    });
    const json = await response.json();
    const recieved = json.isOk;
    expect(recieved).toBe(expected);

});


test("post añadir stats token correcto /7HNH9bkz57LHwa_framLQ", async () => {

    const expected = true;
    data["token"] = "eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.hZnl5amPk_I3tb4O-Otci_5XZdVWhPlFyVRvcqSwnDo_srcysDvhhKOD01DigPK1lJvTSTolyUgKGtpLqMfRDXQlekRsF4XhAjYZTmcynf-C-6wO5EI4wYewLNKFGGJzHAknMgotJFjDi_NCVSjHsW3a10nTao1lB82FRS305T226Q0VqNVJVWhE4G0JQvi2TssRtCxYTqzXVt22iDKkXeZJARZ1paXHGV5Kd1CljcZtkNZYIGcwnj65gvuCwohbkIxAnhZMJXCLaVvHqv9l-AAUV7esZvkQR1IpwBAiDQJh4qxPjFGylyXrHMqh5NlT_pWL2ZoULWTg_TJjMO9TuQ";
    const response = await fetch(URI_STATS_BACKEND, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
    });
    const json = await response.json();
    const recieved = json.isOk;
    expect(recieved).toBe(expected);

});


