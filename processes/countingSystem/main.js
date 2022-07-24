module.exports = {
    execute(message, globalUtilitiesFolder) {
        const { EmbedManager } = globalUtilitiesFolder;

        console.log(new EmbedManager("piss", null, null, null, null, null));
    
        // counting system only handles messages sent by users, not bots.

        // check if message is in the counting channel

        // check if message is NaN and if is, check if the guild is allowing them in the counting channel

        // check the nextNumber entry for the guild, if !== to what the user sent, set the nextNumber back to 1 and add 1 incorrectlyCounted to the user.
        
        // if what the user sent is the correct number
        // add 1 to the users correctlyCounted
        // add 1 to the guilds nextNumber

        // react with some emoji


        /*await countingSchema.create({
            userId: interaction.user.id,
            guildId: interaction.guild.id,
        });

        const countingUser = await countingSchema.findOne({
            userId: interaction.user.id
        });
        
        console.log(countingUser);*/
    }
};