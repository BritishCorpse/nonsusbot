const { getUserItems } = require(`${__basedir}/utilities`);
const { MessageEmbed } = require("discord.js");
const { paginateEmbeds } = require(`${__basedir}/utilities`);
const { Users } = require(`${__basedir}/db_objects`);

module.exports = {
    name: ["badges"],
    description: "See what badges you currently own!",

    usage: [

    ],
    async execute(message) {

        const randomColor = Math.floor(Math.random()*16777215).toString(16);

        const targetUser = message.author;

        const userInDb = await Users.findOne({ where: { user_id: targetUser.id } });

        const items = await getUserItems(targetUser.id);

        let embed;

        const embeds = [];

        function makeEmbed() {
            return new MessageEmbed().setTitle(`Badge list of: ${userInDb.badge || " "}${targetUser.username}`).setColor(randomColor);
        }
 
        if (items.length === 0) {
            message.channel.send(`${userInDb.badge || " "}${targetUser.username} has no badges!`);
            return;
        }

        for (const i in items) {
            const item = items[i];

            if (i % 10 === 0) {
                embed = makeEmbed();
                embeds.push(embed);  
            }

            if (item.item.category === "Badges") {
                embed.addField(`${item.item.itemEmoji}${item.item.name}`, `${item.item.itemDescription}`);
            }
            
            
        }

        paginateEmbeds(message.channel, message.author, embeds);
    }
};
