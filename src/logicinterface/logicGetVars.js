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
        port_backend = await readLocalSecret("../../secrets/port_backend.txt");
        port_frontend = await readLocalSecret("../../secrets/port_frontend.txt");
        redisdb_port = await readLocalSecret("../../secrets/redisdb_port.txt");
        redisdb_host = await readLocalSecret("../../secrets/redisdb_host.txt");
        redisdb_password = await readLocalSecret("../../secrets/redisdb_password.txt");
        endpoint_variables_frontend = await readLocalSecret("../../secrets/endpoint_variables_frontend.txt");

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

    const variablesSinSanitizar =  await dbInterfaces.GetBackendVariables();
    
    const buf = Buffer.from(variablesSinSanitizar);
    const envConfig = dotenv.parse(buf);
    for (const k in envConfig) 
    {
        if (k !== "PUBLIC_SMTP_KEY")
        {
            const variableSanitizadas = await sanitizar(envConfig[k]);
            process.env[k] = variableSanitizadas;
            console.log(`texto sanitizado=${k}=${variableSanitizadas}`);
        }
        else
        {
            process.env[k] = envConfig[k];
            console.log(`+++ texto=${k}:${envConfig[k]}`);
        }
    }

};

const sanitizar = async (textoSinSanitizar) => {

    const textoSanitizado = textoSinSanitizar.replace("\n", "");
    return textoSanitizado;

};



function esperar() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            
            resolve();
            ;
        }, 3000
        );
    });
}

const readSecret = async (secretNameAndPath) => {
    try {
        const dataSinSanitizar = fs.readFileSync(secretNameAndPath, "utf8");
        return dataSinSanitizar;
    }
    catch (err) {
        if (err.code !== "ENOENT") {
            console.error(`An error occurred while trying to read the secret: ${secretNameAndPath}. Err: ${err}`);
        } else {
            console.debug(`Could not find the secret ${secretNameAndPath}. Err: ${err}`);
        }
    }
};



const readLocalSecret = async (secretNameAndPath) => {
    try 
    {
        const archivo = path.resolve(__dirname, secretNameAndPath);
        const dataSinSanitizar = fs.readFileSync(archivo, "utf8");
        return dataSinSanitizar;
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



exports.GetFrontendVars = async (req, res) => 
{

    // console.log("req.headers=" + req.headers);
    console.log("req.header.auth=" + req.headers.authorization + " token_for=" + process.env.TOKEN_FOR_BACKEND_ACCESS);
    if (req.headers.authorization !== process.env.TOKEN_FOR_BACKEND_ACCESS )
    {
        console.log("no son iguales");
        return;
    }

    // const auth = new Buffer.from(authheader.split(" ")[1], "base64").toString().split(":");


    console.log("entrado");
    const variables = await dbInterfaces.GetFrontendVariables();
    console.log("varialbes" + variables);
    res.send({"variables": variables});

};



