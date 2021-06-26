const dbInterfaces = require("../database/dbInterfaceGetVar");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");


exports.GetBackendVars = async () =>
{

    dotenv.config();

    let port_backend = "";
    let port_frontend = "";
    let redisdb_port = "";
    let redisdb_host = "";
    let redisdb_password = "";
    let endpoint_variables_frontend = "";

    if (process.env.LOCAL_SECRETS === "true")
    {
        
        port_backend = await readSecret("../../secrets/port_backend.txt");
        port_frontend = await  readSecret("../../secrets/port_frontend.txt");
        redisdb_port = await  readSecret("../../secrets/redisdb_port.txt");
        redisdb_host = await  readSecret("../../secrets/redisdb_host.txt");
        redisdb_password = await  readSecret("../../secrets/redisdb_password.txt");
        endpoint_variables_frontend = await  readSecret("../../secrets/endpoint_variables_frontend.txt");

    }
    else
    {
        port_backend = await readSecret("/run/secrets/PORT_BACKEND");
        port_frontend = await  readSecret("/run/secrets/PORT_FRONTEND");
        redisdb_port = await  readSecret("/run/secrets/REDISDB_PORT");
        redisdb_host = await  readSecret("/run/secrets/REDISDB_HOST");
        redisdb_password = await  readSecret("/run/secrets/REDISDB_PASSWORD");
        endpoint_variables_frontend = await readSecret("/run/secrets/ENDPOINT_VARIABLES_FRONTEND");

    }
    
    port_backend = port_backend - 0;
    port_frontend = port_frontend - 0;
    redisdb_port = redisdb_port - 0;
    console.log("Seteando variables...");

    await dbInterfaces.ConnectVault(redisdb_port, redisdb_host, redisdb_password );
    // await esperar();

    const variables =  await dbInterfaces.GetBackendVariables();
    const buf = Buffer.from(variables);
    const envConfig = dotenv.parse(buf);
    for (const k in envConfig) {
        process.env[k] = envConfig[k]
        // console.log(`${k}:${envConfig[k]}`);
    }

};

function esperar() {
    return new Promise((resolve, reject) => {
        //here our function should be implemented 
        setTimeout(() => {
            
            resolve();
            ;
        }, 3000
        );
    });
}


const readSecret = async (secretNameAndPath) => {
    try 
    {
        const t = path.resolve(__dirname, secretNameAndPath);
        return fs.readFileSync(t, "utf8");
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
    console.log("varialbes" + variables);
    res.send({"variables": variables});

};



