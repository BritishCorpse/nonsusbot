const { MessageEmbed } = require('discord.js');
const { CurrencyShop } = require(`${__basedir}/db_objects`);
const { paginateEmbeds } = require(`${__basedir}/functions`);

module.exports = {
    name: 'shop',
    description: "Displays the shop.",
    async execute (message, args) {
        
        const embeds = [];

        items = await CurrencyShop.findAll();

        function makeEmbed() {
            return new MessageEmbed().setTitle("Shop").setColor("ORANGE")
        }

        let embed;

        for (const i in items) {
            const item = items[i];

            if (i % 10 === 0) {
                embed = makeEmbed();
                embeds.push(embed);  
            }
                        
            embed.addField(`${item.name}`, `${item.cost}`);
        }

        paginateEmbeds(message.channel, message.author, embeds);
    }
}
