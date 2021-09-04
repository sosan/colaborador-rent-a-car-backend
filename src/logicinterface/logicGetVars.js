const dbInterfaces = require("../database/dbInterfaceGetVar");
const dotenv = require("dotenv");
const openpgp = require("openpgp");
const fs = require("fs");
const path = require("path");


exports.GetBackendVars = async () =>
{

    dotenv.config();

    let redisdb_port = "";
    let redisdb_host = "";
    let redisdb_password = "";

    if (process.env.LOCAL_SECRETS === "true")
    {

        redisdb_port =  process.env.REDISDB_PORT;
        redisdb_host =  process.env.REDISDB_HOST;
        redisdb_password = process.env.REDISDB_PASSWORD;
    }
    else
    {
        redisdb_port = await  readSecret("/run/secrets/REDISDB_PORT");
        redisdb_host = await  readSecret("/run/secrets/REDISDB_HOST");
        redisdb_password = await  readSecret("/run/secrets/REDISDB_PASSWORD");

    }
    

    redisdb_port = await sanitizar(redisdb_port);
    redisdb_host = await sanitizar(redisdb_host);
    redisdb_password = await sanitizar(redisdb_password);

    // port_backend = port_backend - 0;
    // port_frontend = port_frontend - 0;
    // redisdb_port = redisdb_port - 0;
    console.log("Seteando variables...");

    await dbInterfaces.ConnectVault(redisdb_port, redisdb_host, redisdb_password );
    

    const varsEncoded = await dbInterfaces.GetBackendVariables();
    const [publicKey, privateKey] = await dbInterfaces.GetKeysPGP();
    const variablesSinSanitizar = await DecodeVars(varsEncoded, publicKey, privateKey);

    const buf = Buffer.from(variablesSinSanitizar);
    const envConfig = dotenv.parse(buf);
    let tempEnv = {};
    for (const k in envConfig) 
    {
        if (k !== "PUBLIC_SMTP_KEY")
        {
            const variableSanitizadas = await sanitizar(envConfig[k]);
            tempEnv[k] = variableSanitizadas;
            // console.log(`texto sanitizado=${k}=${variableSanitizadas}`);
        }
        else
        {
            tempEnv[k] = envConfig[k];
            // console.log(`+++ texto=${k}:${envConfig[k]}`);
        }
    }
    process.env = tempEnv;

};

const sanitizar = async (textoSinSanitizar) => {

    const textoSanitizado = textoSinSanitizar.replace("\n", "");
    return textoSanitizado;

};

const DecodeVars = async (encriptedVarsNotSanitazed, publicBlockKey, privateBlockKey) =>
{

    // const encriptedVars = encriptedVarsNotSanitazed.replace(new RegExp("_", 'g'), "\n")
    const encriptedVars = encriptedVarsNotSanitazed.trim();

    // const options = {
    //     userIDs: [{ name: "serviciosrentcar", email: "servicios@rentcarmallorca.es" }],
    //     curve: "ed25519",
    //     passphrase: process.env.TOKEN_PGP,
    // };

    // const key = await openpgp.generateKey(options);

    const privateKeyArmored = privateBlockKey;
    const publicKeyArmored = publicBlockKey;

    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
    const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
        passphrase: process.env.TOKEN_PGP
    });

    const message = await openpgp.readMessage({
        armoredMessage: encriptedVars
    });
    const { data: decrypted, signatures } = await openpgp.decrypt({
        message,
        verificationKeys: publicKey, //optionl
        decryptionKeys: privateKey,
        
    });

    return decrypted;

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


exports.GetFrontendVars = async (req, res) => 
{

    if (req.headers.authorization !== process.env.TOKEN_FOR_BACKEND_ACCESS )
    {
        console.log("no son iguales");
        return;
    }

    const variables = await dbInterfaces.GetFrontendVariables();
    res.send({"variables": variables});

};



