const { SlashCommandBuilder } = require("@discordjs/builders");

const { gameInvite, resolveGameInvite, makePlayerObjectList } = require(`${__basedir}/utilities/gameFunctions.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("hostgame")
        .setDescription("Host a game.")
        .addStringOption(option => 
            option 
                .setName("game").setDescription("The game to host")
                .setRequired(true)
                .addChoices(
                    { name: "blackjack", value: "blackjack"}
                )
        ),
        
    async execute(interaction) {    
        await interaction.reply("Starting game!");

        //* get the game that the user wants to host
        const game = await interaction.options.getString("game");

        //* send an inviteMessage to the chat letting other people join
        const inviteMessage = await gameInvite(await interaction.client, game, await interaction.channel, await interaction.user.username);

        const inviteWaitPeriod = 25 * 1000;

        let playerList;
        setTimeout(async() => {
            const messageReaction = await inviteMessage.reactions.resolve("✅");

            playerList = await resolveGameInvite(messageReaction);
            playerList = await makePlayerObjectList(interaction.client, playerList);

            if (playerList.length > 24) return interaction.channel.send("That's too many people!");
            if (playerList.length < 1) return interaction.channel.send("No one wants to play? :(");

            const gameFile = require(`${__basedir}/games/${game}.js`);
            gameFile.execute(interaction.client, interaction, playerList);  
        }, inviteWaitPeriod);


    },
};
