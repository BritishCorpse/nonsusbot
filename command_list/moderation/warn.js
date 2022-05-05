const { circularUsageOption } = require(`${__basedir}/utilities`);

const { UserWarns, GuildWarns } = require(`${__basedir}/db_objects.js`);

module.exports = {
    name: ["warn"],
    description: "Gives a warning to a user.",
    userPermissions: ["MODERATE_MEMBERS"],

    usage: [
        { tag: "user", checks: {isuseridinguild: null},
            next: [
                circularUsageOption(
                    { tag: "reason", checks: {matches: {not: /[^\w?!.,;:'"()/]/}, isempty: {not: null}} }
                )
            ]
        }
    ],

    async execute(message, args) {
        const prefix = message.client.serverConfig.get(message.guild.id).prefix;

        const warnMember = message.mentions.members.first();
        let warnReason = args.slice(1).join(" ");

        //make sure hte member actually exists, this should never be sent cause of the usage thingy above, but its just in case.
        if (!warnMember) {
            return message.channel.send(`Incorrect usage. Proper usage, ${prefix}warn {user} reason`);
        }

        //check to see if theres a warning
        if (!warnReason) warnReason = "No reason provided.";

        // try to find how many warnings the guild already has, this is used for identifying the warns.
        let guildInDb = await GuildWarns.findOne({
            where: {
                guild_id: message.guild.id
            }
        }) || null;

        //if it doesnt exist, create it
        if (guildInDb === null) {
            guildInDb = await GuildWarns.create({
                guild_id: message.guild.id,
                amount: 0,
            });
        // if it exists just give them +1 warningAmount
        } 

        guildInDb.amount += 1;
        await guildInDb.save();
        
        //creates a warning for the user
        await UserWarns.create({
            user_id: warnMember.user.id,
            guild_id: message.guild.id,
            warning: warnReason,
            warnId: guildInDb.amount
        });


        const embed = {
            color: "RED",

            title: "Added a warning to a user.",

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
                    name: "Reason",
                    value: `${warnReason}`
                },
                {
                    name: "Warning ID",
                    value: `${guildInDb.amount}`
                }
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
