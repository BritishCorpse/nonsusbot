const { EmbedBuilder } = require("discord.js");

// Class that is used by all processes for formatting embeds.
class EmbedManager {
    constructor() {
        this.embeds = [];

        this.channels = [];
    }

    // Creates an embed
    createEmbed(title, description, fields, footer, image, color, author) {
        this.embeds.push(
            new EmbedBuilder({
                title: title,
                description: description,
                fields: fields,
                footer: {
                    text: "Powered by mana potions" + (footer || "")
                },
                image: image,
                color: color,
                author: {
                    name: author
                },
                timestamp: new Date().toISOString(),
            })
        ); 
    }

    // Adds fields to an embed
    addFields(embed, fields) {
        return embed.addFields([
            fields
        ]);
    }

    // Adds a channel id to send an embed to
    addChannel(channel) {
        this.channels.push(channel);
    }

    // Sends specified embeds to specified channels.
    sendEmbeds(embeds) {
        for (const channel of this.channels) {
            channel.send({ embeds: embeds });
        }
    }

    // Sets the author of an embed
    setAuthor(embed, author) {
        return embed.setAuthor({
            author
        });
    }
}

module.exports = {
    EmbedManager
};