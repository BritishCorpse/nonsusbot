const { SlashCommandBuilder } = require("@discordjs/builders");
const { makeEmbed} = require(`${__basedir}/utilities/generalFunctions.js`);
const fs = require("node:fs");

const { getCommandCategories } = require(`${__basedir}/utilities/commandFunctions.js`);

function calculateGraveyardUptime(date) {
    // eslint-disable-next-line no-undef
    let timeDifferential = date - startTimestamp;

    if (timeDifferential < 1000) return ["in milliseconds", timeDifferential];

    //time in seconds
    timeDifferential /= 1000;

    if (timeDifferential < 60) return ["in seconds", timeDifferential];

    //time in minutes
    timeDifferential /= 60;

    if (timeDifferential < 60) return ["in minutes", timeDifferential];

    //time in hours
    timeDifferential /= 60; 

    if (timeDifferential < 60) return ["in hours", timeDifferential];

    //time in days
    timeDifferential /= 24; 

    return ["in days", timeDifferential];
}

async function calculateCommandAmount() {
    let commandTotal = 0;

    const categoryFolders = getCommandCategories();
    for (const category of categoryFolders) {
        const commandFiles = fs.readdirSync(`${__basedir}/commands/${category}`)
            .filter(commandFile => commandFile.endsWith(".js"));
    
        for (const commandFile of commandFiles) {
            const command = require(`${__basedir}/commands/${category}/${commandFile}`);
            command.category = category;

            commandTotal += 1;
        }
    }

    return commandTotal;
}

module.exports = {
    developerOnly: true,
    data: new SlashCommandBuilder()
        .setName("dev")
        .setDescription("Test command")
        .addBooleanOption(option => option.setName("uptime").setDescription("How long the bot has been running").setRequired(true))
        .addBooleanOption(option => option.setName("commandamount").setDescription("How many commands the bot has").setRequired(true))
        .addBooleanOption(option => option.setName("servercount").setDescription("How many servers the bot is in").setRequired(true))
        //TODO: add more options like shoutouts and stuff
        //? might move this command away from the dev folder later

    ,
    async execute(interaction) {
        await interaction.deferReply();

        const fields = [];

        const interactionOptions = await interaction.options.data;

        for (let i = 0; i < interactionOptions.length; ++i) {
            const option = interactionOptions[i];

            if (option.value === false) continue; 

            let fieldName = "Null";
            let fieldValue = "Null";

            if (option.name === "uptime") {
                fieldName = `Uptime ${calculateGraveyardUptime(new Date())[0]}`;
                fieldValue = calculateGraveyardUptime(new Date())[1];
            }

            else if (option.name === "commandamount") {
                fieldName = "Amount of commands";
                fieldValue = await calculateCommandAmount();
            }

            else if (option.name === "servercount") {
                fieldName = "Servers";
                fieldValue = await interaction.client.guilds.cache.size;
            }

            //! YOU CANNOT PASS IN "RAW" VARIABLES TO EMBED FIELDS. INSTEAD DO IT LIKE THIS
            // `${variable}` NOT variable
            fields.push({
                name: `${fieldName}`,
                value: `${fieldValue}`
            });
        }

        await interaction.editReply({ embeds: [ await makeEmbed(interaction.client, "Developer Information", fields, "#00f0f0") ] });
    }
};