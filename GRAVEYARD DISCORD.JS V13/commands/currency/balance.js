const { SlashCommandBuilder } = require("@discordjs/builders");

const { userCurrency } = require(`${__basedir}/db_objects.js`);

const { Embed } = require(`${__basedir}/utilities/generalClasses.js`);

const { info } = require(`${__basedir}/configs/colors.json`);

const { gravestone } = require(`${__basedir}/configs/emojis.json`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("See a users balance.")
        .addUserOption(option => 
            option.setName("user").setDescription("Which users balance you want to view").setRequired(true)
        ),
        
    async execute(interaction) {
        const user = await interaction.options.getUser("user");
        if (user.bot) return interaction.reply("You cannot view the balance of bots.");

        await interaction.deferReply();

        const balance = await userCurrency.getBalance(user.id);

        const fields = [
            {
                name: "Balance",
                value: `${balance}${gravestone}`
            }
        ];

        await interaction.editReply({ embeds: [new Embed(`${user.username}'s balance.`, null, null, fields, null, info)] });
    },
};
