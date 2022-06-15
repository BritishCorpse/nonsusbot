const fs = require("fs");

async function log(log) {
    fs.appendFile("./logs.txt", `\n${new Date().toUTCString()} ${log}`, function () {
        console.log(`${new Date().toUTCString()} ${log}`);
    }); 
}

module.exports = {
    log
};