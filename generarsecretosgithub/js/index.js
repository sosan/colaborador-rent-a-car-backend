const enviarGist = async (evento) =>
{
    
    let token = document.getElementById("token").value;
    let codigoUsuario = document.getElementById("codigo").value;
    let nombreusuario = document.getElementById("nombreusuario").value;
    let nombrerepo = document.getElementById("nombrerepo").value;

    if (token === "" || codigoUsuario === "" || nombreusuario === "" || nombrerepo === "" || codigoUsuario.indexOf("=") === -1) {
        return;
    }

    const codigoConvertido = codigoUsuario.split("\n");

    const getPublicKeyRaw = await fetch(`https://api.github.com/repos/${nombreusuario}/${nombrerepo}/actions/secrets/public-key`, {
        method: "GET",
        headers: {
            'Authorization': `token ${token}`,
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json",
        },
        
    });

    const resultadoPublicKey = await getPublicKeyRaw.json();
    let listadoResultados = [];
    
    for (let i = 0; i < codigoConvertido.length; i++)
    {
        const listData = codigoConvertido[i].split("=");
        if (listData === undefined || listData.length > 2)
        {
            listadoResultados.push(await GenerateTextSuccess(404, codigoConvertido[i]));
            continue;
        }
        const nombreSecreto = listData[0];
        const valorSecreto = listData[1];

        const messageBytes = Buffer.from(valorSecreto);
        const keyBytes = Buffer.from(resultadoPublicKey.key, 'base64');

        const encryptedBytes = sodium.crypto_box_seal(messageBytes, keyBytes);
        
        const encrypted = Buffer.from(encryptedBytes).toString('base64');
        console.log(encrypted);

        let data = {
            "encrypted_value": encrypted,
            "key_id": resultadoPublicKey.key_id
        };
    
        const createRaw = await fetch(`https://api.github.com/repos/${nombreusuario}/${nombrerepo}/actions/secrets/${nombreSecreto}`, {
            method: "PUT",
            headers: {
                'Authorization': `token ${token}`,
                "Accept": "application/vnd.github.v3+json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        listadoResultados.push(await GenerateTextSuccess(createRaw.status, codigoConvertido[i]));
        
    }
    
    document.getElementById("resultado").innerHTML = listadoResultados.toString().replaceAll(",", "");

}


const GenerateTextSuccess = async (status, texto) =>
{

    let listadoResultados = [];
    if (status === 201) {
        listadoResultados.push(`+ ${texto} --> (insertado)`);
        listadoResultados.push("\n");
    }
    else if (status === 204) {
        listadoResultados.push(`: ${texto} --> (modificado)`);
        listadoResultados.push("\n");
    }
    else {
        listadoResultados.push(`X ${texto} --> (error)`);
        listadoResultados.push("\n");
    }
    return listadoResultados;
};
document.getElementById("btnEnviarGist").addEventListener("click", enviarGist);