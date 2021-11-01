const fetch = require("node-fetch");



exports.asyncFetchGet = async (url) => {

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-type": "application/json"
        }
    });
    return await response.json();

};

exports.asyncFetchPost = async (url, data) => {

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
    });
    return await response.json();
    
};

