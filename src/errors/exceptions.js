function CustomExceptions(message) {
    const error = new Error(message);

    error.code = "ERROR CODIGO CUSTOM";
    return error;

}

// CustomExceptions.prototype = Object.create(Error.prototype);

module.exports = { CustomExceptions }