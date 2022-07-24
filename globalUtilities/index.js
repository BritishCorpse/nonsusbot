const fs = require("fs");


const files = fs.readdirSync(`${__basedir}/globalUtilities`)
    .filter(file => file.endsWith(".js") && file !== "index.js");

for (const file of files) {
    module.exports = Object.assign(module.exports, require(`${__basedir}/globalUtilities/${file}`));
}
