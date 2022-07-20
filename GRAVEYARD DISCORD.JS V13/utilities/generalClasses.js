
// this class replaces the before known "paginateEmbeds" function. 

const { MessageActionRow, MessageButton } = require("discord.js");
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
        const buttonRow = new MessageActionRow();

        // button = array of buttons
        buttons.forEach(button => {
            // check if the buttontype provided is correct.
            this.checkButtonType(button.buttonType);

            buttonRow.addComponents(
                new MessageButton()
                    .setCustomId(button.buttonType)
                    .setLabel(button.buttonText)
                    .setStyle(button.buttonStyle),
            );
        });

        this.actionRows.push(buttonRow);
    }

    // puts the buttons in the message
    async pushButtons(message) {
        message.edit({ content: message.content, components: this.actionRows });
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
    async collectButtonPresses(channel, userId, timeLimit, embeds) {
        const filter = interaction => interaction.user.id === userId;

        const collector = channel.createMessageComponentCollector({ filter, time: timeLimit * 1000 });

        collector.on("collect", async (interaction) => {
            if (!interaction.isButton) return log("Skipped interaction which was not a button.");

            await this.handleButtonInteractions(interaction, embeds);
        });

        collector.on("end", collected => {
            if (collected.size < 1) {
                return channel.send("No interactions received.");
            }
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

module.exports = {
    ClassName,
    EmbedButtonManager
};