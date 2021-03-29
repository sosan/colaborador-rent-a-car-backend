const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const cartaIcono = document.getElementById("cartaicono");
const claveIcono = document.getElementById("claveicono");

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

