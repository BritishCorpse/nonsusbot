module.exports = {
    name: "discordInteractionCreate",
    execute(client, globalUtilitiesFolder) {
        client.on("interactionCreate", async interaction => {
            if (interaction.isChatInputCommand() === false) {
                return;
            }

            const command = client.commands.get(interaction.commandName);
            if (!command) {
                return;
            }

            if (!interaction.member.permissions.has(command.userPermissions)) {
                await interaction.reply(`You're missing the permissions: \`${command.userPermissions}\``);
                return;
            }

            if (!interaction.guild.members.me.permissions.has(command.botPermissions)) {
                await interaction.reply(`I'm missing the permissions: \`${command.botPermissions}\``);
                return;
            }

            await interaction.deferReply();

            await command.execute({ data: { content: interaction, globalUtilitiesFolder } }).catch(error => {
                return console.log(error);
            });
        });
    },
};
