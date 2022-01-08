const { MessageEmbed } = require("discord.js");
const { CurrencyShop } = require(`${__basedir}/db_objects`);
const { paginateEmbeds } = require(`${__basedir}/functions`);

module.exports = {
    name: "shop",
    description: "Displays the shop.",
    
    usage: [
    ],

    async execute (message) {
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        
        const embeds = [];

        const items = await CurrencyShop.findAll();

        function makeEmbed() {
            return new MessageEmbed().setTitle("Shop!").setColor(randomColor);
        }

        let embed;

        for (const i in items) {
            const item = items[i];

            if (i % 10 === 0) {
                embed = makeEmbed();
                embeds.push(embed);  
            }
                        
            embed.addField(`${item.itemEmoji}${item.name}, ${item.itemDescription}`, `${item.cost}<:ripcoin:929440348831354980>`);
        }

        paginateEmbeds(message.channel, message.author, embeds, {useDropdown: true});
    }
};
