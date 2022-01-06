const { Users, CurrencyShop } = require(`${__basedir}/db_objects`);
const { circularUsageOption } = require(`${__basedir}/functions`);
const { userHasItem } = require(`${__basedir}/functions`);
const { Op } = require("sequelize");

module.exports = {
    name: "changebadge",
    description: "Change your badge if you have one.",
    usage: [
        circularUsageOption(
            { tag: "item", checks: {matches: {not: /[^\w?!.,;:'"()]/}, isempty: {not: null}} }
        )   
    ],
    async execute(message, args) {
        const userId = message.author.id;

        const item = await CurrencyShop.findOne({
            where: {
                name: {
                    [Op.like]: args.join(" ")
                }
            }
        });

        if (!item) return message.channel.send("That item doesn't exist.");

        if (item.category !== "Badges") {
            message.channel.send("Item is not a badge.");
            return;
        }

        if (!await userHasItem(message.author.id, args.join(" "))) {
            message.channel.send("It appears that you do not own this badge.");
            return;
        }

        message.channel.send("Your new badge has been applied!");

        await Users.update({ badge: item.itemEmoji }, { where: { user_id: userId } });
    }
};
