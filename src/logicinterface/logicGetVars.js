const dbInterfaces = require("../database/dbInterfaceGetVar");
const dotenv = require('dotenv');
// const fetch = require("node-fetch");

exports.GetBackendVars = async () =>
{
    await dbInterfaces.ConnectDB();
    const variables = await dbInterfaces.GetBackendVariables();
    const buf = Buffer.from(variables);

    const envConfig = dotenv.parse(buf);
    for (const k in envConfig) {
        process.env[k] = envConfig[k]
    }

};


exports.GetFrontendVars = async (req, res) => {

    console.log("entrado");
    const variables = await dbInterfaces.GetFrontendVariables();

    res.send({"variables": variables});

    // const buf = Buffer.from(variables);

    // const envConfig = dotenv.parse(buf);
    // for (const k in envConfig) {
    //     process.env[k] = envConfig[k]
    // }

};



