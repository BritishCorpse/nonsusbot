const { UserWarns } = require(`${__basedir}/db_objects.js`);

const { paginateEmbeds } = require(`${__basedir}/utilities`);

const { MessageEmbed } = require("discord.js");
module.exports = {
    name: ["listwarn", "listwarns"],
    description: "List the warns of a user!",
    usage: [ 
        { tag: "user", checks: {isuseridinguild: null}}
    ],

    /* Checking if the user has the permission to use the command. */
    userPermissions: ["MODERATE_MEMBERS"],
    async execute(message) {
        const user = message.mentions.users.first();

        /* Finding all the warns of a user. */
        const warns = await UserWarns.findAll({
            where: {
                user_id: user.id,
                guild_id: message.guild.id
            }
        }) || null;

        /* Checking if the user has no warns. */
        if (warns === null || warns.length < 1) {
            return message.channel.send("User has no warns.");
        }

        const embeds = [];

        /**
         * It creates a new embed object with the author set to the bot's username, avatar, and website.
         * @returns A new MessageEmbed object.
         */
        function makeEmbed() {
            return new MessageEmbed({
                author: {
                    name: "Moderation Assistant",
                    icon_url: message.client.user.avatarURL(),
                    url: "https://talloween.github.io/graveyardbot/",
                },

                color: "33a5ff",
            });
        }
        
        let embed;

        /* Creating a new embed every 10 warns. */
        for (const i in warns) {
            const warn = warns[i];

            if (i % 10 === 0) {
                embed = makeEmbed();
                embeds.push(embed);  
            }
                        
            /* Adding a field to the embed. */
            embed.addField(`Warn: \`${warn.warning}\``, `ID: \`${warn.warnId}\``);
        }

        /* Sending the embeds to the channel. */
        paginateEmbeds(message.channel, message.author, embeds, {useDropdown: true});
    }
};