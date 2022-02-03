const { MessageEmbed } = require("discord.js");
//const { circularUsageOption } = require(`${__basedir}/functions`);


module.exports = {
    name: "selfroles",
    description: "Self roles description (TODO)",
    userPermissions: [],

    usage: [
        { tag: "setup", checks: {is: "setup"} }
    ],

    execute(message, args) {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        const prefix = message.client.serverConfig.get(message.guild.id).prefix;

    }
};
