const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");

function formatBacktick(name) {
    return `\`\`${name}\`\``;
}

function addPageNumbersToFooter(embed, page, maxPage) {
    return new MessageEmbed(embed).setFooter({text: `(${page}/${maxPage}) ${embed.footer ? embed.footer.text : ""}`});
}

async function sendLog(embed, channel) {
    await channel.send({ embeds: [embed] });
}

async function makeEmbed(graveyard, title, fields, color, image) {
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

        image: {
            url: image,
        },
    });
}

async function sendGuildLog(graveyard, title, fields, color, image, logType, guild) {
    //* we return if detailedlogging is set to false
    const detailedLogging = await graveyard.serverConfig.get(guild.id).logType || null;
    if (detailedLogging === null || detailedLogging === false) return;

    //* we return if the logchannel isn't defined. 
    if ((await graveyard.serverConfig.get(guild.id).log_channel[1] || null) === null) {
        return;   
    }

    const logChannel = await graveyard.channels.fetch(await graveyard.serverConfig.get(guild.id).log_channel[1]);

    const embed = await makeEmbed(graveyard, title, fields, color, image, logType);

    await sendLog(embed, logChannel);
}

async function paginateEmbeds(channel, allowedUser, embeds, { useDropdown=false, useButtons=true, messageToEdit=null, previousEmoji="<", nextEmoji=">", addPagesInFooter=true, timeout=120000 }={}) {
    // Idea from https://www.npmjs.com/package/discord.js-pagination
    // Creates reactions allowing multiple embed pages

    // channel is the channel to send to
    // allowedUser is the user who can flip the pages
    // if messageToEdit is given, it will edit that message instead of sending a new one
    // if useDropdown is true, it shows a dropdown to switch pages
    // if useButtons is true, it shows buttons to switch pages (both useDropdown and useButtons can be set)
    // if addPagesInFooter is true, it adds page number before the footer

    const maxIndex = embeds.length - 1;
    let currentIndex = 0;

    const rows = [];

    let selectMenuRow;
    let buttonRow;

    if (embeds.length > 1) { // only add buttons and menu if it has more than one page
        if (useDropdown) {
            selectMenuRow = new MessageActionRow();
            const selectMenu = new MessageSelectMenu()
                .setCustomId("dropdown");

            embeds.forEach((embed, i) => {
                selectMenu.addOptions({
                    label: `Page ${i + 1}${embed.title ? `: ${embed.title}` : ""}`,
                    value: i.toString(),
                    default: i === 0
                });
            });

            selectMenuRow.addComponents(selectMenu);
            rows.push(selectMenuRow);
        }

        if (useButtons) {
            buttonRow = new MessageActionRow();
            buttonRow.addComponents(
                new MessageButton()
                    .setCustomId("previous")
                    .setLabel(previousEmoji)
                    .setStyle("PRIMARY"),
                new MessageButton()
                    .setCustomId("next")
                    .setLabel(nextEmoji)
                    .setStyle("PRIMARY")
            );
            rows.push(buttonRow);
        }
    }

    let message;
    if (messageToEdit === null) {
        let newEmbed = embeds[currentIndex];
        if (addPagesInFooter)
            newEmbed = addPageNumbersToFooter(newEmbed, currentIndex + 1, maxIndex + 1);

        message = await channel.send({embeds: [newEmbed], components: rows});
    } else {
        message = messageToEdit;
    }

    if (embeds.length === 1) return; // don't create filters/collectors if only one page

    const filter = interaction => (interaction.customId === "previous"
                                   || interaction.customId === "next"
                                   || interaction.customId === "dropdown")
                                  && interaction.user.id === allowedUser.id;

    const collector = message.createMessageComponentCollector({filter, time: timeout});

    collector.on("collect", interaction => {
        if (interaction.customId === "previous") {
            if (currentIndex === 0)
                currentIndex = maxIndex; // loop back around
            else
                currentIndex--; 
        } else if (interaction.customId === "next") {
            if (currentIndex === maxIndex)
                currentIndex = 0;
            else
                currentIndex++;
        } else if (interaction.customId === "dropdown") {
            currentIndex = Number.parseInt(interaction.values[0]);
        }

        if (useDropdown) {
            selectMenuRow.components[0].options.forEach(option => {
                option.default = false;
            });
            selectMenuRow.components[0].options[currentIndex].default = true;
        }

        let newEmbed = embeds[currentIndex];
        if (addPagesInFooter)
            newEmbed = addPageNumbersToFooter(newEmbed, currentIndex + 1, maxIndex + 1);

        interaction.update({embeds: [newEmbed], components: rows});
    });

    collector.on("end", () => {
        rows.forEach(row => {
            row.components.forEach(component => {
                component.setDisabled(true);
                if (component.type === "BUTTON")
                    component.setStyle("SECONDARY");
            });
        });

        message.edit({components: rows});
    });
}

module.exports = {
    formatBacktick,
    makeEmbed,
    sendGuildLog,
    paginateEmbeds
};