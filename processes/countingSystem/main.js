const CountingChannels = require("./databaseSchemaCountingChannel");

module.exports = {
    async execute(message, globalUtilitiesFolder) {
        // will do once ive finished the database manager :)
        return;
        if (message.author.bot) return;

        const {EmbedManager} = globalUtilitiesFolder;

        const embedManager = new EmbedManager();

        embedManager.createEmbed("Embed 1", "null1", null, null, null, null, null);
        embedManager.createEmbed("Embed 2", "null1", null, null, null, null, null);

        embedManager.addChannel(message.channel);
        embedManager.addChannel(await message.client.channels.fetch("988026812816826441"));

        return embedManager.sendEmbeds(embedManager.embeds);

        // counting system only handles messages sent by users, not bots.

        // check if message is in the counting channel

        // check if message is NaN and if is, check if the guild is allowing them in the counting channel

        // check the nextNumber entry for the guild, if !== to what the user sent, set the nextNumber back to 1 and add 1 incorrectlyCounted to the user.

        // if what the user sent is the correct number
        // add 1 to the users correctlyCounted
        // add 1 to the guilds nextNumber

        // react with some emoji


        /* await countingSchema.create({
            userId: interaction.user.id,
            guildId: interaction.guild.id,
        });

        const countingUser = await countingSchema.findOne({
            userId: interaction.user.id
        });

        console.log(countingUser);*/
    },
};
