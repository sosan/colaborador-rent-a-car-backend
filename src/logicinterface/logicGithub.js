const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");



exports.GuardarTraduccion = async (traduccion, nombreusuario, nombrerepo) =>
{

    const shaFile = await GetShaFile(nombreusuario, nombrerepo);
    const contentBase64 = Buffer.from(JSON.stringify(traduccion), "utf-8").toString("base64");

    const body = {
        "message": "Update traduccion",
        "content": contentBase64,
        "sha": shaFile,
        "branch": "backend",

    };

    const updateFileGithubRaw = await fetch(`https://api.github.com/repos/${nombreusuario}/${nombrerepo}/contents/locales/locales.json`, {
        method: "PUT",
        headers: {
            'Authorization': `token ${process.env.TOKEN_UPDATE_GIT}`,
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json",
            
        },
        body: JSON.stringify(body)
    
    });
    
    const resultadoUpdateFile = await updateFileGithubRaw.json();
    

}


const GetShaFile = async (nombreusuario, nombrerepo) =>
{
    // https://api.github.com/repos/sosan/Colaborador-rent-a-car-backend/contents/locales/locales.json

    let getResponseRaw = await fetch(`https://api.github.com/repos/${nombreusuario}/${nombrerepo}/contents/locales/locales.json`, {
        method: "GET",
        headers: {
            'Authorization': `token ${process.env.TOKEN_UPDATE_GIT}`,
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json",
        },

    });

    let response = await getResponseRaw.json();

    return response["sha"];


};

const SaveFile = async (nameFile, texto) => {
    try {
        const archivo = path.resolve(__dirname, `../../public/${nameFile}`);
        await fs.promises.writeFile(archivo, texto, "utf-8");
        return true;
    }
    catch (err) {
        if (err.code !== "ENOENT") {
            console.error(`An error occurred while trying to read the secret: ${nameFile}. Err: ${err}`);

        } else {
            console.debug(`Could not find the secret ${nameFile}. Err: ${err}`);

        }
        return false;
    }
};