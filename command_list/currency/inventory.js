const { getUserItems } = require(`${__basedir}/functions`);
const { MessageEmbed } = require('discord.js');
const { paginateEmbeds } = require(`${__basedir}/functions`);
const { Users } = require(`${__basedir}/db_objects`);

module.exports = {
    name: 'inventory',
    description: "Shows your inventory, or someone else's.",

    usage: [
        { tag: "nothing", checks: {isempty: null} },
        { tag: "user", checks: {isuseridinguild: null} }
    ],

    async execute (message, args) {
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        
        const targetUser = message.mentions.users.first() || message.author;

        const userInDb = await Users.findOne({ where: { user_id: targetUser.id } });

        const items = await getUserItems(targetUser.id);

        const embeds = [];

        function makeEmbed() {
            return new MessageEmbed().setTitle(`${userInDb.badge || ' '}${targetUser.username}'s inventory!`).setColor(randomColor)
        }

        let embed;

        if (items.length === 0) {
            message.channel.send(`${userInDb.badge || ' '}${targetUser.username} has nothing!`);
            return;
        }

        for (const i in items) {
            const item = items[i];

            if (i % 10 === 0) {
                embed = makeEmbed();
                embeds.push(embed);  
            }
                        
            embed.addField(`${item.item.itemEmoji}${item.item.name}`, `Amount: ${item.amount}`);
        }
        
        paginateEmbeds(message.channel, message.author, embeds);
    }
}
