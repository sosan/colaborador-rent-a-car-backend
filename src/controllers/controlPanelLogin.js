const logicControlPanel = require("../logicinterface/logic_controlPanel");
const fs = require('fs');
const nanoid = require("nanoid");

exports.GetPanelLogin = async (req, res) =>
{

    

};


exports.PanelLoginRegister = async (req, res) =>
{

    const isOk = await logicControlPanel.CheckEmailUsernamePassword(req.body.username, req.body.email, req.body.password);

    if (isOk === false) {
        return res.send({ "isOk": false });
    }

    // comprobar credenciales
    const existeUsuario = await logicControlPanel.CheckAdminUserPassword(req.body.email, req.body.password);
    
    const stringAleatorio = nanoid.nanoid();
    const array = Uint8Array.from(
        stringAleatorio, c => c.charCodeAt(0));

    return res.send(
        {
            "isOk": isOk,
            "usuarioexiste": existeUsuario,
            "success": array
        }
    );
    // if (existeUsuario === false)
    // {
    // }
    // else
    // {
    //     //JWT ------ >
    //     // credenciales validas
    //     // https://webauthn.io/
    //     // https://www.youtube.com/results?search_query=MRMCD2019
    //     // https://webauthn.guide/
    //     // https://www.youtube.com/watch?v=11XBDqesTIk
    // }
    




};



exports.GenerateHMTLForGeneralConditions = async (req, res) =>
{

    


  
};