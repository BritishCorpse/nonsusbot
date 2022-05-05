const { MessageEmbed } = require("discord.js");

const { CurrencyShop } = require(`${__basedir}/db_objects`);
const { paginateEmbeds } = require(`${__basedir}/utilities`);
const { gravestone } = require(`${__basedir}/emojis.json`);

module.exports = {
    name: ["shop"],
    description: "Displays the shop.",
    
    usage: [
    ],

    async execute (message) {   
        const embeds = [];

        const items = await CurrencyShop.findAll();

        function makeEmbed() {
            return new MessageEmbed({
                title: "What can I offer you today?",

                url: "https://talloween.github.io/graveyardbot/",

                author: {
                    name: "Hoarder",
                    icon_url: message.client.user.avatarURL(),
                    url: "https://talloween.github.io/graveyardbot/",
                },

                color: "33a5ff",
            });
        }
        
        let embed;

        for (const i in items) {
            const item = items[i];

            if (i % 10 === 0) {
                embed = makeEmbed();
                embeds.push(embed);  
            }
                        
            embed.addField(`${item.itemEmoji}${item.name}, ${item.itemDescription}`, `${item.cost}${gravestone}`);
        }

        paginateEmbeds(message.channel, message.author, embeds, {useDropdown: true});
    }
};
