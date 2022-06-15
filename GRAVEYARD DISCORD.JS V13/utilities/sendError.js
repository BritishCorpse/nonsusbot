const fs = require("fs");

async function sendError(error) {
    fs.appendFile("./errors.txt", `\nAt ${new Date().toUTCString()}: {${error.name} ${error.message}}`, function () {
        console.log(`At ${new Date().toUTCString()}: {${error.name} ${error.message}}`);
    }); 
}

module.exports = {
    sendError
};