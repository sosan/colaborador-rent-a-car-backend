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
    let token_pgp = "";
    if (process.env.LOCAL_SECRETS === "true")
    {
        redisdb_port =  process.env.REDISDB_PORT;
        redisdb_host =  process.env.REDISDB_HOST;
        redisdb_password = process.env.REDISDB_PASSWORD;
        token_pgp = process.env.TOKEN_PGP;
    }
    else
    {
        redisdb_port = await readSecret(`${process.env.SECRET_MOUNT_PATH}/REDISDB_PORT`);
        redisdb_host = await readSecret(`${process.env.SECRET_MOUNT_PATH}/REDISDB_HOST`);
        redisdb_password = await readSecret(`${process.env.SECRET_MOUNT_PATH}/REDISDB_PASSWORD`);
        token_pgp = await readSecret(`${process.env.SECRET_MOUNT_PATH}/TOKEN_PGP`);

    }
    

    redisdb_port = await sanitizar(redisdb_port);
    redisdb_host = await sanitizar(redisdb_host);
    redisdb_password = await sanitizar(redisdb_password);
    token_pgp = await sanitizar(token_pgp);

    console.log("Seteando variables...");

    await dbInterfaces.ConnectVault(redisdb_port, redisdb_host, redisdb_password );
    

    const varsEncoded = await dbInterfaces.GetBackendVariables();
    const [publicKey, privateKey] = await dbInterfaces.GetKeysPGP();
    const variablesSinSanitizar = await DecodeVars(varsEncoded, publicKey, privateKey, token_pgp);

    const buf = Buffer.from(variablesSinSanitizar);
    const envConfig = dotenv.parse(buf);
    let tempEnv = {};
    for (const k in envConfig) 
    {
        if (k !== "PUBLIC_SMTP_KEY")
        {
            const variableSanitizadas = await sanitizar(envConfig[k]);
            tempEnv[k] = variableSanitizadas;
        }
        else
        {
            tempEnv[k] = envConfig[k];

        }
    }
    process.env = tempEnv;

};

const sanitizar = async (textoSinSanitizar) => {

    const textoSanitizado = textoSinSanitizar.replace("\n", "");
    return textoSanitizado;

};

const DecodeVars = async (encriptedVarsNotSanitazed, publicBlockKey, privateBlockKey, token_pgp) =>
{

    const encriptedVars = encriptedVarsNotSanitazed.trim();

    const privateKeyArmored = privateBlockKey;
    const publicKeyArmored = publicBlockKey;

    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
    const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
        passphrase: token_pgp
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



