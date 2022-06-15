const fs = require("fs");

async function sendError(error) {
    fs.appendFile("./errors.txt", `\n${new Date().toUTCString()} ${error.name} ${error.message}`, function () {
        console.log("An error occured.");
    }); 
}

module.exports = {
    sendError
};