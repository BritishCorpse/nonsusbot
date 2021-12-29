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
            return new MessageEmbed().setTitle("Shop").setColor("ORANGE").setFooter("penis")
        }

        let embed = makeEmbed();


        for (const i in items) {
            const item = items[i];
            
            embed.addField(`${item.name}`, `${item.cost}`);

            if ((i + 1) % 10 === 0) {
                pages.push(embed);  
                let embed = makeEmbed();
            }
        }

        paginateEmbeds(message.channel, message.author, embeds);
    }
}
