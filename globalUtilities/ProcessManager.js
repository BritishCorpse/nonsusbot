class ProcessManager {
    executeProcesses(client, event, data) {
        client.processes.forEach(process => {
            if (process.event === event) {
                const processFile = require(`${process.path}`);

                processFile.execute(data);
            }
        });
    }

    listProcesses(client) {
        client.processes.forEach(process => {
            log(`Added a ${process.event} process event file: ${process.path}`);
        });
    }
}

module.exports = {
    ProcessManager,
};
