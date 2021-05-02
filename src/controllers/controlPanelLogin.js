const logicControlPanel = require("../logicinterface/logic_controlPanel");
const fs = require('fs');


exports.postContronPanelLogin = async (req, res) =>
{

    if (req.body.email === undefined || req.body.password === undefined) return res.redirect(404, "/");

    if (req.body.email === "" || req.body.password === "") return res.redirect(404, "/");

    if (req.body.username !== "") return res.redirect(404, "/");

    //comprobar el cookie device
    const deviceCookie = req.cookies['devicecookie'];
    if (deviceCookie)
    {

    }

    const authRestricted = req.cookies["authrestricted"];
    if (authRestricted)
    {
        //reject
        return;
    }


    // comprobar credenciales
    const existeUsuario = await logicControlPanel.CheckUserPassword(req.body.email, req.body.password);

    if (existeUsuario === false)
    {
        return res.send(
            {
                "usuarioexiste": false
            }
        );
    }
    else
    {
        //JWT ------ >
        // credenciales validas
        // https://webauthn.io/
        // https://www.youtube.com/results?search_query=MRMCD2019
        // https://webauthn.guide/
        // https://www.youtube.com/watch?v=11XBDqesTIk
    }
    




};


exports.GenerateHMTLForGeneralConditions = async (req, res) =>
{

    


  
};