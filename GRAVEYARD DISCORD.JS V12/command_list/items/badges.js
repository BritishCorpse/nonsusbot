const { getUserItems } = require(`${__basedir}/utilities`);
const { MessageEmbed } = require("discord.js");
const { paginateEmbeds } = require(`${__basedir}/utilities`);
const { Users } = require(`${__basedir}/db_objects`);

function makeEmbed(userInDb, target, color) {
    return new MessageEmbed().setTitle(`Badge list of: ${userInDb.badge || " "}${target.username}`).setColor(color);
}

module.exports = {
    name: ["badges"],
    description: "See what badges you currently own!",

    usage: [
        { tag: "nothing", checks: {isempty: null} },
        { tag: "user", checks: {isuseridinguild: null} }
    ],
    async execute(message) {
        const target = message.mentions.users.first() || message.author;

        const randomColors = ["RED", "GREEN", "BLUE", "YELLOW", "ORANGE", "BLACK", "WHITE"];
        const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
    
        const userInDb = await Users.findOne({ where: { user_id: target.id } });
        const userItems = await getUserItems(target.id);

        if (userItems.length < 1) {
            message.channel.send(`${userInDb.badge || ""}${message.author.username} has no badges!`);
            return;
        }

        let embed;
        const embeds = [];

        for (const i in userItems) {
            const item = userItems[i];

            if (i % 10 === 0) {
                embed = makeEmbed(userInDb, target, randomColor);
                embeds.push(embed);  
            }

            if (item.item.category === "Badges") {
                embed.addField(`${item.item.itemEmoji}${item.item.name}`, `${item.item.itemDescription}`);
            }
        }

        paginateEmbeds(message.channel, message.author, embeds);
    }
};
