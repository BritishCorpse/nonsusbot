const { userHasItem } = require(`${__basedir}/functions`);


module.exports = {
    name: "vip",
    description: "Become a VIP, if you have a VIP pass and VIP is available.",

    usage: [
    ],

    async execute(message){
        const prefix = message.client.serverConfig.get(message.guild.id).prefix;

        // Check if there is a vip role
        const vipRoleId = message.client.serverConfig.get(message.guild.id).vip_role_id;
        const vipRole = await message.guild.roles.cache.get(vipRoleId);

        if (vipRole === undefined) {
            message.channel.send(`There is no VIP role for this server. See ${prefix}config.`);
            return;
        }

        if (await userHasItem(message.author.id, "VIP pass")) {
            message.channel.send("It appears you have the VIP pass. Welcome to the VIP Group!");
            // Give vip role
            message.member.roles.add(vipRole);
        } else {
            message.channel.send(`You do not have the VIP pass. See the ${prefix}shop to buy it.`);
        }
    }
};
