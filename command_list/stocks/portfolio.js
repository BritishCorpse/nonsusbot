const { MessageEmbed } = require("discord.js");
const { paginateEmbeds } = require(`${__basedir}/functions`);
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
            message.reply("You do not exist in the database!");
            return;
        }

        const portfolio = UserPortfolio.findAll({
            where: { user_id: message.author.id },
        });

        async function getUserItems(userId) {
            const user = await Users.findOne({
                where: {
                    user_id: userId
                }
            });

            if (user === null)
                return [];

            return await portfolio;
        }

        const shares = await getUserItems(message.author.id);

        const embeds = [];

        function makeEmbed() {
            return new MessageEmbed().setTitle(`${userInDb.badge || " "}${targetUser.username}'s portfolio!`).setColor(randomColor);
        }

        if (shares.length === 0) {
            message.channel.send(`${userInDb.badge || " "}${targetUser.username} has nothing!`);
            return;
        }

        let embed;
        for (const s in shares) {
            const share = shares[s];

            if (s % 10 === 0) {
                embed = makeEmbed();
                embeds.push(embed);  
            }
        
            console.log(share);
            embed.addField(`${share.shares.name}`, `Amount: ${share.amount}`);
        }

        paginateEmbeds(message.channel, message.author, embeds, {useDropdown: false});
    }
};
