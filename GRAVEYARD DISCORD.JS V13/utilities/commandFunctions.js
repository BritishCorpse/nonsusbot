const fs = require("fs");

function getCommandCategories() {
    return fs.readdirSync(`${__basedir}/commands`);
}

module.exports = {
    getCommandCategories
};