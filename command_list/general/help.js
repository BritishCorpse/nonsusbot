module.exports = {
    name: ["commands", "help"],
    usage: [],
    description: "Shows the commands that Graveyard has!",
    execute(message){
        message.reply("https://talloween.github.io/graveyardbot/commands.html");
    }
};