const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("voice")
        .setDescription("Mute, unmute, deafen and kick people from voice channels")
        .addSubcommand(subcommand =>
            subcommand.setName("mute").setDescription("Mute someone in a voice channel")
                .addUserOption(option => option.setName("user").setDescription("The user to mute").setRequired(true)))
        .addSubcommand(subcommand => 
            subcommand.setName("unmute").setDescription("Unmute someone in a voice channel")
                .addUserOption(option => option.setName("user").setDescription("The user to unmute").setRequired(true)))
        .addSubcommand(subcommand => 
            subcommand.setName("kick").setDescription("Kick someone from a voice channel")
                .addUserOption(option => option.setName("user").setDescription("The user to kick").setRequired(true)))
        .addSubcommand(subcommand => 
            subcommand.setName("deafen").setDescription("Deafen someone in a voice channel")
                .addUserOption(option => option.setName("user").setDescription("The user to deafen").setRequired(true)))
        .addSubcommand(subcommand => 
            subcommand.setName("undeafen").setDescription("Undeafen someone in a voice channel")
                .addUserOption(option => option.setName("user").setDescription("The user to undeafen").setRequired(true))),

        
    async execute(interaction) {
        const user = await interaction.options.getUser("user");

        const guildMember = await interaction.guild.members.cache.find(member => member.id === user.id);

        if (!guildMember.voice.channel) return await interaction.reply({ content: "User is not connected to a voice channel.", ephemeral: true });
        if (guildMember.moderatable === false) return await interaction.reply({ content: "I cannot moderate this member.", ephemeral: true });

        const subcommand = await interaction.options.getSubcommand();

        if (subcommand === "mute") {
            guildMember.voice.setMute(true);

            await interaction.reply(`Muted ${guildMember} in ${guildMember.voice.channel}.`);
        }

        else if (subcommand === "unmute") {
            guildMember.voice.setMute(false);

            await interaction.reply(`Unmuted ${guildMember} in ${guildMember.voice.channel}.`);
        }

        else if (subcommand === "kick") {
            guildMember.voice.disconnect();

            await interaction.reply(`Kicked ${guildMember} from ${guildMember.voice.channel}.`);
        }

        else if (subcommand === "deafen") {
            guildMember.voice.setDeaf(true);

            await interaction.reply(`Deafened ${guildMember} in ${guildMember.voice.channel}.`);
        }

        else if (subcommand === "undeafen") {
            guildMember.voice.setDeaf(false);

            await interaction.reply(`Undeafened ${guildMember} in ${guildMember.voice.channel}.`);
        }
    },
};
