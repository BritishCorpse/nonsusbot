module.exports = {
    name: 'changebadge',
    description: 'Change your badge if you have one.',
    usage: [
        circularUsageOption(
            { tag: "item", checks: {matches: {not: /[^\w?!.,;:'"\(\)]/}, isempty: {not: null}} }
        )   
    ],
    execute(message, args) {
        message.channel.send("yes");

        await Users.update({ badge: userBadge }, { where: { user_id: userId } });
    }
}