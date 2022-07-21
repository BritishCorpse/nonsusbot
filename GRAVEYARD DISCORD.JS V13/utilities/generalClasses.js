
// this class replaces the before known "paginateEmbeds" function. 

const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require("discord.js");
const { log } = require("./botLogFunctions");

// you can add buttons and other interactions like dropdown menus to embeds with this.
class EmbedButtonManager {
    //empty constructor because we dont really do anything with it.
    constructor() {}

    currentIndex = 1;
    actionRows = [];

    checkButtonType(buttonType) {
        const allowButtonTypes = [
            "next",
            "previous",
            "end",
            "start",
            "yes",
            "no"
        ];

        if (!allowButtonTypes.includes(buttonType)) {
            throw new Error("Incorrect button type.");
        }
    }

    // adds some buttons to the list of buttons
    async addButtons(buttons) {
        const buttonRow = new ActionRowBuilder();

        // button = array of buttons
        buttons.forEach(button => {
            // check if the buttontype provided is correct.
            this.checkButtonType(button.buttonType);

            buttonRow.addComponents(
                new ButtonBuilder()
                    .setCustomId(button.buttonType)
                    .setLabel(button.buttonText)
                    .setStyle(button.buttonStyle),
            );
        });

        this.actionRows.push(buttonRow);
    }

    // puts the buttons in the message
    async pushButtons(message, channel) {
        if (message === undefined) {
            channel.send({ components: this.actionRows });
        } else {
            message.edit({ components: this.actionRows });
        }
    }

    // after we receive button interactions, we handle them here
    // depending on the .customId property of the button, we will do certain actions
    async handleButtonInteractions(buttonInteraction, embeds) {
        const maxIndex = embeds.length;

        if (buttonInteraction.customId === "next") {
            // if we've reached the last embed, this loops back around.
            if (this.currentIndex === maxIndex) {
                this.currentIndex = 1;
            } else {
                this.currentIndex += 1;
            }

            await buttonInteraction.update({ content: `Page: ${this.currentIndex}`, embeds: [embeds[this.currentIndex - 1]] });

        }

        else if (buttonInteraction.customId === "previous") {
            if (this.currentIndex === 1) {
                this.currentIndex = maxIndex;
            } else {
                this.currentIndex -= 1;
            }

            await buttonInteraction.update({ content: `Page: ${this.currentIndex}`, embeds: [embeds[this.currentIndex - 1]] });
        }

        else if (buttonInteraction.customId === "start") {
            this.currentIndex = 1;

            await buttonInteraction.update({ content: `Page: ${this.currentIndex}`, embeds: [embeds[this.currentIndex - 1]] });
        }

        else if (buttonInteraction.customId === "end") {
            this.currentIndex = maxIndex;
            
            await buttonInteraction.update({ content: `Page: ${this.currentIndex}`, embeds: [embeds[this.currentIndex - 1]] });
        }               
    }
    
    // creates a messageComponentCollector in a provided channel
    // when it receives an interaction, it will call the handleButtonInteractions method
    async collectButtonPresses(channel, userId, timeLimit, embeds, message) {
        // channel: where to wait for the interactions
        // userId: which user's interactions we're listening for
        // timeLimit: amount of time in seconds that the user has to not interact for the collector to end
        // embeds: an array containing multiple embeds
        // message: the message that has the interactions we're looking for.
        const filter = interaction => interaction.user.id === userId && interaction.message.id === message.id;

        const collector = channel.createMessageComponentCollector({ filter, time: timeLimit * 1000 });

        collector.on("collect", async (interaction) => {
            if (!interaction.isButton()) return log("Skipped interaction which was not a button.");

            await this.handleButtonInteractions(interaction, embeds);
        });

        collector.on("end", async collected => {
            if (collected.size < 1) {
                channel.send("Are you still awake? (No interactions were received)");
            }

            this.actionRows.forEach(row => {
                row.components.forEach(component => {
                    component.setDisabled(true);
                    if (component.type === "Button")
                        component.setStyle(ButtonStyle.Secondary);
                });
            });
    
            message.edit({components: this.actionRows});
        });
    }
}

// test class
class ClassName {
    constructor() {  }
    method_1() { 
        console.log("test"); 
    }
}

// class for creating embeds
class Embed {
    constructor(title, description, footer, fields, image, color, author) {
        return new EmbedBuilder({
            author: {
                name: author
            },
            title: title,
            description: description,
            footer: {
                text: `Powered by Mana potions. ${footer || ""}`,
            },
            fields: fields,
            image: image,
            color: color,
        });
    }

    addField(field) {
        this.addFields([field]);
    }

    changeToLogEmbed(logType) {
        this.setDescription(`${this.data.description + logType}`);
    }
}

module.exports = {
    ClassName,
    EmbedButtonManager,
    Embed
};