const { MessageEmbed } = require("discord.js");

function formatBacktick(name) {
    return `\`\`${name}\`\``;
}

async function makeEmbed(graveyard, title, fields, color) {
    return new MessageEmbed({
        title: title,

        fields: fields,

        author: {
            name: "Graveyard",
            icon_url: `${graveyard.user.avatarURL()}`,
            url: "https://talloween.github.io/graveyardbot/",
        },

        color: color,

        timestamp: new Date(),

        footer: {
            text: "Powered by Mana Potions",
        },
    });
}

module.exports = {
    formatBacktick,
    makeEmbed
};