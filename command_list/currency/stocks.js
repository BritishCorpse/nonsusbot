const { MessageEmbed } = require("discord.js");
const { Stocks } = require(`${__basedir}/db_objects`);
const { paginateEmbeds } = require(`${__basedir}/functions`);

module.exports = {
    name: "stocks",
    description: "Displays the stock market!",
    
    usage: [
    ],

    async execute (message) {
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        
        const embeds = [];

        const stocks = await Stocks.findAll();

        function makeEmbed() {
            return new MessageEmbed().setTitle("Stocks!").setColor(randomColor);
        }

        let embed;

        for (const i in stocks) {
            const stock = stocks[i];

            if (i % 10 === 0) {
                embed = makeEmbed();
                embeds.push(embed);  
            }
                        
            embed.addField(`${stock.id}. ${stock.name}`, `Last price: ${stock.oldPrice}<:ripcoin:929759319296192543>, Currenct price: ${stock.currentPrice}<:ripcoin:929759319296192543>`);
        }

        paginateEmbeds(message.channel, message.author, embeds, {useDropdown: true});
    }
};
