const fs = require("fs");

module.exports = {
    execute(client) {
        const processFolders = fs.readdirSync(`${__basedir}/processes`);

        for (const process of processFolders) {
            const processEventFolders = fs.readdirSync(`${__basedir}/processes/${process}/processEvents`);

            for (const processEventFolder of processEventFolders) {
                const eventFolderFiles = fs.readdirSync(`${__basedir}/processes/${process}/processEvents/${processEventFolder}`).filter(file => file.endsWith(".js"));

                for (const eventFolderFile of eventFolderFiles) {
                    client.processes.push(
                        {
                            path: `${__basedir}/processes/${process}/processEvents/${processEventFolder}/${eventFolderFile}`,
                            event: processEventFolder,
                        },
                    );
                }
            }
        }
    },
};
