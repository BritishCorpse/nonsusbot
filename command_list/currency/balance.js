const { MessageEmbed } = require("discord.js");
const { Users } = require(`${__basedir}/db_objects`);
const { gravestone } = require(`${__basedir}/emojis.json`);

module.exports = {
    name: ["balance", "bal"],
    description: "Shows your balance, or someone else's balance.",

    usage: [
        { tag: "user", checks: {isuseridinguild: null} },
        { tag: "nothing", checks: {isempty: null} }
    ],

    async execute (message) {
        const target = message.mentions.users.first() || message.author;
        const randomColor = Math.floor(Math.random()*16777215).toString(16);

        const userInDb = await Users.findOne({ where: {user_id: target.id }});

        const embed = new MessageEmbed()
            .setTitle(`${userInDb.badge || " "} ${target.username}`)
            .addField("Balance", `${message.client.currency.getBalance(target.id)}${gravestone}`)
            .setDescription("Remember, this is just wallet worth, *NOT* net worth.")
            .setColor(randomColor);

        message.reply({ embeds: [embed] });
        

    }
};
