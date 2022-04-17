const { MessageEmbed } = require("discord.js");
const { paginateEmbeds } = require(`${__basedir}/utilities`);
const { Users } = require(`${__basedir}/db_objects`);
const { UserPortfolio } = require(`${__basedir}/db_objects`);

module.exports = {
    name: ["portfolio", "pf"],
    description: "Shows your portfolio.",

    usage: [
        { tag: "nothing", checks: {isempty: null} },
        { tag: "user", checks: {isuseridinguild: null} }
    ],

    async execute (message) {
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        
        const targetUser = message.mentions.users.first() || message.author;

        // Check if user exists in the database, if the user doesnt exist, send an error message.
        const userInDb = await Users.findOne({ where: { user_id: targetUser.id } });
        if (!userInDb) {
            message.reply("Target does not exist in the database!");
            return;
        }

        async function getUserShares(userId) {

            // Gets the porfolio of the user
            const portfolio = await UserPortfolio.findAll({
                where: {
                    user_id: userId
                },
                include: ["shares"]
            });

            if (portfolio === null)
                return [];

            return portfolio;
        }
        
        const shares = await getUserShares(targetUser.id);

        const embeds = [];

        function makeEmbed() {
            return new MessageEmbed().setTitle(`${userInDb.badge || " "}${targetUser.username}'s portfolio!`).setColor(randomColor);
        }

        if (shares.length === 0) {
            message.channel.send(`${userInDb.badge || " "}<@!${targetUser.id}> has nothing!`);
            return;
        }

        // Declare embeds existance, just so its here, yaknow its nice to have :)
        let embed;

        for (let i = 0; i < shares.length; ++i) {
            if (i % 10 === 0) {
                embed = makeEmbed();
                embeds.push(embed);  
            }
        
            if (shares[i].amount === 0) {console.log(shares[i].amount); continue;}

            embed.addField(`${shares[i].shares.name}, Worth: ${shares[i].shares.currentPrice}<:ripcoin:929759319296192543>`, `Owned: ${shares[i].amount}`);
            
        }

        // Check if the embeds array has any element with zero fields in it, if so, splice the element from the array.
        for (let i = 0; i < embeds.length; ++i) {
            if (embeds[i].fields.length === 0) {
                embeds.splice(embeds[i], 1);
            }
        }

        if (embeds.length < 1) {return message.channel.send(`${userInDb.badge || " "}${targetUser.username} has nothing!`);}

        paginateEmbeds(message.channel, message.author, embeds, {useDropdown: false});
    }
};
