const { EmbedBuilder } = require("discord.js");

// Class that is used by all processes for formatting embeds.
class EmbedManager {
    constructor(title, description, fields, footer, image, color, author) {
        return new EmbedBuilder({
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
            timestamp: new Date().now,
        }); 
    }

    addFields(fields) {
        this.addFields([
            fields
        ]);
    }
}

module.exports = {
    EmbedManager
};