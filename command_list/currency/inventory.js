const { getUserItems } = require(`${__basedir}/functions`);
const { MessageEmbed } = require("discord.js");
const { paginateEmbeds } = require(`${__basedir}/functions`);

module.exports = {
    name: "inventory",
    description: "Shows your inventory, or someone else's.",

    usage: [
        { tag: "nothing", checks: {isempty: null} },
        { tag: "user", checks: {isuseridinguild: null} }
    ],

    async execute (message, args) {
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        
        const targetUser = message.mentions.users.first() || message.author;

        const items = await getUserItems(targetUser.id);

        const embeds = [];

        function makeEmbed() {
            return new MessageEmbed().setTitle(`${targetUser.user}'s inventory!`).setColor(randomColor);
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
};
