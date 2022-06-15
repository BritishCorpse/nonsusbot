const fs = require("fs");

async function log(log) {
    fs.appendFile("./logs.txt", `\nAt ${new Date().toUTCString()}: {${log}}`, function () {
        console.log(`At ${new Date().toUTCString()}: {${log}}`);
    }); 
}

module.exports = {
    log
};