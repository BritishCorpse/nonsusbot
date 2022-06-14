const fs = require("fs");

async function sendError(error) {
    const date = new Date().toUTCString();

    fs.writeFile(`${date}`, error, function (err) {
        if (err) throw err;
        console.log(`\nAn error occured. Check the file ${date}.txt in the logs folder.\n`);
    }); 
}

module.exports = {
    sendError
};