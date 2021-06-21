const dbInterfaces = require("../database/dbInterfaceGetVar");
const dotenv = require("dotenv");
const fs = require("fs");

exports.GetBackendVars = async () =>
{

    dotenv.config();

    console.log("REDISDB_HOST");

    const port_backend = await readSecret("/run/secrets/PORT_BACKEND");
    const port_frontend = await readSecret("/run/secrets/PORT_FRONTEND");
    const redisdb_port = await readSecret("/run/secrets/REDISDB_PORT");
    const redisdb_host = await readSecret("/run/secrets/REDISDB_HOST");
    const redisdb_password = await readSecret("/run/secrets/REDISDB_PASSWORD");
    const endpoint_variables_frontend = await readSecret("/run/secrets/ENDPOINT_VARIABLES_FRONTEND");
    
    // MONGO_DB_URI
    await dbInterfaces.ConnectVault(redisdb_port, redisdb_host, redisdb_password );
    const variables = await dbInterfaces.GetBackendVariables();
    const buf = Buffer.from(variables);

    const envConfig = dotenv.parse(buf);
    for (const k in envConfig) {
        process.env[k] = envConfig[k]
        console.log(`${k}:${envConfig[k]}`);
    }

};


const readSecret = async (secretNameAndPath) => {
    try 
    {
        return fs.readFileSync(`${secretNameAndPath}`, "utf8");
    } 
    catch (err)
    {
        if (err.code !== "ENOENT")
        {
            console.error(`An error occurred while trying to read the secret: ${secretNameAndPath}. Err: ${err}`);
        } else {
            console.debug(`Could not find the secret ${secretNameAndPath}. Err: ${err}`);
        }
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



