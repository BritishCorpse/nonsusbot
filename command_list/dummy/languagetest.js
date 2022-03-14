const { translateForGuild } = require(`${__basedir}/functions`);


module.exports = {
    name: "languagetest",
    description: "test translations",
    developer: true,

    usage: [
    ],

    async execute (message) {
        message.channel.send(translateForGuild(message.guild, "Hello"));
    }
};
