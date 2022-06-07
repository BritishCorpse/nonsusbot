// This file combines all module.exports in this utilities/ folder into one module.exports
// To require anything in utilities/, just do:
// const { someFunction } = require(`${__basedir}/utilities`);
// Note that this only works when the __basedir global variable exists (i.e. from the root index.js)
const fs = require("fs");


const files = fs.readdirSync(`${__basedir}/utilities`)
    .filter(file => file.endsWith(".js") && file !== "index.js");

for (const file of files) {
    module.exports = Object.assign(module.exports, require(`${__basedir}/utilities/${file}`));
}
