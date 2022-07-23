const fs = require("node:fs");

module.exports = {
    name: "messageCreate",
    async execute(client) {
        const processesToExecute = [];

        const processFolders = fs.readdirSync(`${__basedir}/processes/`);

        for (const process of processFolders) {
            const processInfoFiles = fs.readdirSync(`${__basedir}/processes/${process}`).filter(processInfoFile => processInfoFile.endsWith(".json"));

            for (const processInfoFile of processInfoFiles) {
                const infoFile = require(`${__basedir}/processes/${process}/${processInfoFile}`);

                if (infoFile.triggeredBy === this.name) {
                    processesToExecute.push(`${__basedir}/processes/${process}/main.js`);
                }
            }
        }

        client.on("messageCreate", message => {
            processesToExecute.forEach(process => {
                const processToExecute = require(process);

                processToExecute.execute(message);
            });
        });
    }
};