module.exports = {
    name: "messageCreate",
    execute(client) {
        client.on("messageCreate", message => {
            console.log(message);
        })
    }
}