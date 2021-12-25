const { MessageEmbed } = require('discord.js');
const { CurrencyShop } = require(`${__basedir}/db_objects`);


module.exports = {
    name: 'shop',
    description: "Displays the shop.",
    async execute (message, args) {
        const embed = new MessageEmbed()
        .setTitle("Shop page: 1")
        .setColor("ORANGE")
        const items = await CurrencyShop.findAll();

        for(const item of items){
            embed.addField(`${item.name}`, `${item.cost}💰`);
        }

        message.channel.send( {embeds: [embed]} );

    }
}
