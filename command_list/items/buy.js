const { Op } = require("sequelize");
const { Users, CurrencyShop } = require(`${__basedir}/db_objects`);
const { circularUsageOption } = require(`${__basedir}/utilities`);


module.exports = {
    name: ["buy"],
    description: "Buys an item from the shop.",

    usage: [
        circularUsageOption(
            { tag: "item", checks: {matches: {not: /[^\w?!.,;:'"()#]/}, isempty: {not: null}, isinteger: {not: null}} } // not integer check needed if there is the amount given
        ),
        { tag: "amount", checks: {isinteger: null},
            next: [
                circularUsageOption(
                    { tag: "item", checks: {matches: {not: /[^a-zA-Z?!.,;:'"()]/}, isempty: {not: null}, isinteger: {not: null}} }
                )
            ]
        }
    ],

    async execute (message, args) {
        let amount = 1;
        if (Number.parseInt(args[0]).toString() === args[0]) {
            amount = Number.parseInt(args.shift());
        }

        const item = await CurrencyShop.findOne({
            where: {
                name: {
                    [Op.like]: args.join(" ")
                }
            }
        });

        if (!item) {
            message.channel.send("That item doesn't exist.");
            return;
        }

        if (item.cost * amount > message.client.currency.getBalance(message.author.id)) {
            message.channel.send(`You don't have enough <:ripcoin:929759319296192543>'s, ${message.author.username}`);
            return;
        }

        if (item.category === "Badges") {
            message.channel.send("Looks like you've bought a badge! We'll go ahead and apply that for you.");
            await Users.update({ badge: item.itemEmoji }, { where: { user_id: message.author.id } });
        }
        
        message.reply(`You bought ${amount} ${item.itemEmoji}**${item.name}**.`);
        const user = await Users.findOne({
            where: {
                user_id: message.author.id
            }
        });

        message.client.currency.add(message.author.id, -item.cost * amount);
        for (let i = 0; i < amount; ++i) {
            await user.addItem(item);
        }
    }
};
