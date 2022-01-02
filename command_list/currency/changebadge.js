const { Users } = require(`${__basedir}/db_objects`);
const { circularUsageOption } = require(`${__basedir}/functions`);


module.exports = {
    name: "changebadge",
    description: "Change your badge if you have one.",
    usage: [
        circularUsageOption(
            { tag: "item", checks: {matches: {not: /[^\w?!.,;:'"()]/}, isempty: {not: null}} }
        )   
    ],
    async execute(message, args) {
        message.channel.send("yes");

        let userBadge; // = ??
        let userId;    // = ??
        await Users.update({ badge: userBadge }, { where: { user_id: userId } });
    }
};
