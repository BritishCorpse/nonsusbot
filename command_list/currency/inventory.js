const { getUserItems } = require(`${__basedir}/functions`);
const { MessageEmbed } = require('discord.js');
const { paginateEmbeds } = require(`${__basedir}/functions`);

module.exports = {
    name: 'inventory',
    description: "Shows your inventory, or someone else's.",
    async execute (message, args) {
        const targetUser = message.mentions.users.first() || message.author;

        const items = await getUserItems(targetUser.id);

        const embeds = [];

        function makeEmbed() {
            return new MessageEmbed().setTitle(`${targetUser}'s inventory!`).setColor("ORANGE")
        }

        let embed;

        if (items.length === 0) {
            message.channel.send(`${targetUser.tag} has nothing!`);
            return;
        }

        for (const i in items) {
            const item = items[i];

            if (i % 10 === 0) {
                embed = makeEmbed();
                embeds.push(embed);  
            }
                        
            embed.addField(`${item.item.name}`, `Amount: ${item.amount}`);
        }
        
        paginateEmbeds(message.channel, message.author, embeds);
    }
}
