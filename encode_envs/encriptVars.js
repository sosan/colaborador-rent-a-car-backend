const openpgp = require("openpgp");
const fs = require("fs");
const path = require("path");

async function encryptVars() {

    const options = {
        userIDs: [{ name: "serviciosrentcar", email: "servicios@rentcarmallorca.es" }],
        curve: "ed25519",
        passphrase: "dummy_qwerty_CHANGE_5252827edac9787f671_8f_433c0eCc673f_B3519IiOiI_xM5_5282DkwIi",
    };

    const privateKeyArmored = fs.readFileSync(path.join(__dirname, "../secrets/private_pgp.txt"), "utf8");
    const publicKeyArmored = fs.readFileSync(path.join(__dirname, "../secrets/public_pgp.txt"), "utf8");

    const plainData = fs.readFileSync(path.join(__dirname, "../.env.local"), "utf8");

    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
    const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
        passphrase: options.passphrase
    });

    const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: plainData }),
        encryptionKeys: publicKey,
        signingKeys: privateKey // optional
    });

    console.log("encrypted in encrypted-secrets.local. ");

    fs.writeFileSync(path.join(__dirname, "./encrypted-secrets.local"), encrypted.trim());

    const encriptedText = fs.readFileSync(path.join(__dirname, "./encrypted-secrets.local"), "utf8");

    const message = await openpgp.readMessage({
        armoredMessage: encriptedText
    });
    const { data: decrypted, signatures } = await openpgp.decrypt({
        message,
        verificationKeys: publicKey, //optionl
        decryptionKeys: privateKey
    });

    fs.writeFileSync(path.join(__dirname, "./decrypted-secrets.local"), decrypted);
    console.log("encriptado en encrypted-secrets.local")
}

encryptVars();