const nodemailer = require("nodemailer");


const USUARIO_CORREO = `${process.env.USUARIO_CORREO}`;
const PASSWORD_CORREO = `${process.env.PASSWORD_CORREO}`;
const SERVIDOR_SMTP = `${process.env.SERVIDOR_SMTP}`;
const PUBLIC_SMTP_KEY = `${process.env.PUBLIC_SMTP_KEY}`.replace(new RegExp("_", 'g'), "\n");

// console.log("SERVIDOR SMTP: " + process.env.SERVIDOR_SMTP);

// TODO: generarlo como global
exports.transporter = nodemailer.createTransport({
    host: `${SERVIDOR_SMTP}`,
    port: 587,
    secure: false, //STARTTLS necesita empezar como texto plano, luego encripta el mensaje
    auth: {
        user: `${USUARIO_CORREO}`,
        pass: `${PASSWORD_CORREO}`,
    },
    dkim: {
        domainName: "rentcarmallorca.es",
        keySelector: "s1",
        privateKey: `${PUBLIC_SMTP_KEY}`
    }
});