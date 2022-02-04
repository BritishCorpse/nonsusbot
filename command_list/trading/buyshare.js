const { Op } = require("sequelize");
const { Users } = require(`${__basedir}/db_objects`);
const { Stocks } = require(`${__basedir}/db_objects`);
const { circularUsageOption } = require(`${__basedir}/functions`);


module.exports = {
    name: "buyshare",
    description: "Buy shares from the stock market!",
    usage: [
        circularUsageOption(
            { tag: "item", checks: {matches: {not: /[^a-zA-Z?!.,;:'"()]/}, isempty: {not: null}} }
        ),
        { tag: "amount", checks: {isinteger: null},
            next: [
                circularUsageOption(
                    { tag: "item", checks: {matches: {not: /[^a-zA-Z?!.,;:'"()]/}, isempty: {not: null}} }
                )
            ]
        }
    ],
    async execute(message, args) {
        let amount = 1;
        if (Number.parseInt(args[0]).toString() === args[0]) {
            amount = Number.parseInt(args.shift());
        }

        const share = await Stocks.findOne({
            where: {
                name: {
                    [Op.like]: args.join(" ")
                }
            }
        });

        if (!share) {
            message.channel.send("That share doesn't exist.");
            return;
        }


        if (share.currentPrice * amount > message.client.currency.getBalance(message.author.id)) {
            return message.channel.send(`You don't have enough <:ripcoin:929759319296192543>'s, ${message.author.username}`);
        }

        if (share.currentPrice === "0") {
            message.channel.send("STOCK NOT AVAILABLE: Share price less than 1.");
            return;
        }

        message.reply(`You bought ${amount} ${share.name} share{amount !== 1 ? 's' : ''}.`);

        const user = await Users.findOne({
            where: {
                user_id: message.author.id
            }
        });

        for (let i = 0; i < amount; ++i) {
            message.client.currency.add(message.author.id, -share.currentPrice);
            await user.addShare(share);
        }
    }
};
