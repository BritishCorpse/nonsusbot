const { getUserItems } = require(`${__basedir}/utilities`);
const { MessageEmbed } = require("discord.js");
const { paginateEmbeds } = require(`${__basedir}/utilities`);
const { Users } = require(`${__basedir}/db_objects`);

const { gravestone } = require(`${__basedir}/emojis.json`); 

module.exports = {
    name: ["inventory", "inv"],
    description: "Shows your inventory, or someone else's.",

    usage: [
        { tag: "nothing", checks: {isempty: null} },
        { tag: "user", checks: {isuseridinguild: null} }
    ],

    async execute (message) {
        // Random colour for the embed.
        const randomColor = "33a5ff";
        
        const targetUser = message.mentions.users.first() || message.author;

        // Find the user in the database to make sure that they exist using the targetusers id.
        const userInDb = await Users.findOne({ where: { user_id: targetUser.id } });

        // Get all of the users items, function is from functions.js (NOT ANYMORE in functions.js)
        const items = await getUserItems(targetUser.id);

        const embeds = [];

        function makeEmbed() {
            return new MessageEmbed().setTitle(`Inventory of: ${userInDb.badge || ""}${targetUser.username}`).setColor(randomColor);
        }

        if (items.length === 0) {
            message.channel.send(`${userInDb.badge || ""}${targetUser.username} has nothing!`);
            return;
        }

        let embed;
        let itemsWorth = 0;

        for (let i = 0; i < items.length; ++i) {
            const item = items[i];

            if (i % 10 === 0) {
                embed = makeEmbed();
                embeds.push(embed);  
            }
            if (item.amount === 0) {continue;}

            let itemEmoji;
            if(item.item.itemEmoji !== null) itemEmoji = item.item.itemEmoji;

            embed.addField(`${itemEmoji || ""}${item.item.name || ""}`, `Amount: ${item.amount || ""}\nCost: ${item.item.cost || ""}${gravestone}`);

            itemsWorth += parseInt(items[i].item.cost * items[i].amount);
            embed.setDescription(`Inventory worth: ${itemsWorth || ""}${gravestone || ""}`);
        }

        // Check if an embed has 0 fields, due to skipped items in the db, if so, remove the embed entirely from the array.
        for (let i = 0; i < embeds.length; ++i) {
            if (embeds[i].fields.length === 0) {
                embeds.splice(embeds[i], 1);
            }
        }

        // Check if any embeds were added to the embeds array, sanity check because items.amount can be 0 due to sell command.
        if (embeds.length < 1) {return message.channel.send(`${userInDb.badge || ""}${targetUser.username} has nothing!`);}
        
        paginateEmbeds(message.channel, message.author, embeds);
    }
};
