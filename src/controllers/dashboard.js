const path = require("path");

exports.GetDashboard = async (req, res) =>
{
    
    res.render(path.join(__dirname, '../../public/dashboard.html') );

};

exports.RedirectGetDashboard = async (req, res) => {

    res.redirect("/dashboard");

};
