const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const cartaIcono = document.getElementById("cartaicono");
const claveIcono = document.getElementById("claveicono");

const botonRegistro = document.getElementById("registro");
const botonLogin = document.getElementById("login");


botonRegistro.addEventListener("click", async (evento) =>
{

    evento.preventDefault();
    
    const username = document.getElementById("username").value;
    const success = document.getElementById("success").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const registro = document.getElementById("registro").value;


    const body = {
        "username": username,
        "success": success,
        "email": email,
        "password": password,
        "boton": registro
    };

    const responseRaw = await fetch("/0_QJFs2NH9a_f_a_BQ_NTib_Y3O6Ik_DkWIiW_mFtZSI/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body)
    });

    const dataResponse = await responseRaw.json();
    const publicKeyCredentialCreationOptions = {
        challenge: dataResponse.success,
        rp: {
            name: "nombre seguridad",
            id: "duosecurity.com",
        },
        user: {
            id: Uint8Array.from(
                "UZSL85T9AFC", c => c.charCodeAt(0)),
            name: "lee@webauthn.guide",
            displayName: "Lee",
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        authenticatorSelection: {
            authenticatorAttachment: "cross-platform",
        },
        timeout: 60000,
        attestation: "direct"
    };

    const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
    });



});


emailInput.addEventListener("focusin", (evento) => {

    cartaIcono.classList.remove("rellenar-blanco");
    cartaIcono.classList.add("rellenar-rosa")
});

passwordInput.addEventListener("focusin", (evento) => {

    claveIcono.classList.remove("rellenar-blanco");
    claveIcono.classList.add("rellenar-rosa")
});


emailInput.addEventListener("focusout", (evento) =>
{

    if (emailInput.validity.valid === true)
    {
        cartaIcono.classList.remove("rellenar-rosa");
        cartaIcono.classList.add("rellenar-blanco")
    }

});

passwordInput.addEventListener("change", (evento) =>
{
    claveIcono.classList.remove("rellenar-rosa");
    claveIcono.classList.add("rellenar-blanco")
});

passwordInput.addEventListener("focusout", (evento) => {

    if (passwordInput.validity.valid === true)
    {
        claveIcono.classList.remove("rellenar-rosa");
        claveIcono.classList.add("rellenar-blanco")

    }


});

