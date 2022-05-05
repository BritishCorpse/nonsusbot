const { circularUsageOption } = require(`${__basedir}/utilities`);

const { UserWarns } = require(`${__basedir}/db_objects.js`);

module.exports = {
    name: ["removewarn"],
    description: "Remove warnings from a user.",
    userPermissions: ["MODERATE_MEMBERS"],

    usage: [
        { tag: "user", checks: {isuseridinguild: null},
            next: [
                circularUsageOption(
                    { tag: "id", checks: {matches: {not: /[^\w?!.,;:'"()/]/}, isempty: {not: null}} }
                )
            ]
        }
    ],

    async execute(message, args) {
        const prefix = message.client.serverConfig.get(message.guild.id).prefix;

        const warnMember = message.mentions.members.first();
        const warnId = args[1];

        //make sure hte member actually exists, this should never be sent cause of the usage thingy above, but its just in case.
        if (!warnMember) {
            return message.channel.send(`Incorrect usage. Proper usage, ${prefix}removewarn {user} id`);
        }

        //creates a warning for the user
        const destroyedWarn = await UserWarns.findOne({
            where: {
                warnId: warnId,
                user_id: warnMember.user.id,
            }
        }) || null;

        if (destroyedWarn === null) {
            return message.channel.send(`A warn with the id \`${warnId}\` was not found.`);
        }

        await UserWarns.destroy({
            where: {
                warnId: warnId,
                user_id: warnMember.user.id,
            }
        });

        const embed = {
            color: "GREEN",

            title: "Removed a warning from a user.",

            author: {
                name: "Logger.",
                icon_url: message.client.user.displayAvatarURL(),
                url: "https://talloween.github.io/graveyardbot/",
            },
    
            fields: [
                {
                    name: "User",
                    value: `${warnMember.user}`
                },
                {
                    name: "Warn Id",
                    value: `${warnId}`
                },
            ],

            timestamp: new Date(),
            
            thumbnail: `${warnMember.user.displayAvatarURL()}`,

            footer: {
                text: "Powered by Graveyard",
            },
        };

        //send them a log notifying them that it worked.
        message.channel.send({ embeds: [embed] });

        // try to send the same embed in the logchannel.
        //Check if the log channel exists.
        let logChannel;

        if (message.client.serverConfig.get(message.guild.id).log_channel_id) {
            logChannel = await message.client.channels.fetch(message.client.serverConfig.get(message.guild.id).log_channel_id);
        }  

        if (logChannel === undefined) return;

        logChannel.send({embeds: [embed]});
        return;
    }
};
