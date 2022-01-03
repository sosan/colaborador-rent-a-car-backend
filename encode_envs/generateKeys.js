const openpgp = require("openpgp");
const fs = require("fs");
const path = require("path");

let privateKeyArmored = undefined;
let publicKeyArmored = undefined;

async function generateKeys() {

    const options = {
        userIDs: [{ name: "serviciosrentcar", email: "servicios@rentcarmallorca.es" }],
        curve: "ed25519",
        passphrase: "dummy_qwerty_CHANGE_5252827edac9787f671_8f_433c0eCc673f_B3519IiOiI_xM5_5282DkwIi",
    };

    const key = await openpgp.generateKey(options);

    privateKeyArmored = key.privateKey;
    publicKeyArmored = key.publicKey;

    fs.writeFileSync(path.join(__dirname, "../secrets/private_pgp.txt"), key.privateKey);
    fs.writeFileSync(path.join(__dirname, "../secrets/public_pgp.txt"), key.publicKey);

    console.log("las keys estan en ../secrets/private_pgp.txt y ../secrets/public_pgp.txt. subir las keys a la db");
}

generateKeys();