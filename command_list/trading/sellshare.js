const { Op } = require("sequelize");
const { Stocks } = require(`${__basedir}/db_objects`);
const { circularUsageOption } = require(`${__basedir}/utilities`);
const { UserPortfolio } = require(`${__basedir}/db_objects`);

module.exports = {
    name: ["sellshare"],
    description: "Sell shares from the stock market!",
    usage: [
        circularUsageOption(
            { tag: "item", checks: {matches: {not: /[^a-zA-Z?!.,;:'"()]/}, isempty: {not: null}, isinteger: {not: null}} } // is integer check needed if there is amount given
        ),
        { tag: "amount", checks: {isinteger: null},
            next: [
                circularUsageOption(
                    { tag: "item", checks: {matches: {not: /[^a-zA-Z?!.,;:'"()]/}, isempty: {not: null}, isinteger: {not: null}} }
                )
            ]
        }
    ],
    async execute(message, args ){
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
        
        // Find the share in the users portfolio.
        const shareInDb = await UserPortfolio.findOne({
            where: { user_id: message.author.id, share_id: share.id}
        });

        // Check for share amount, if 0 complain that they dont have the share..
        if (shareInDb.amount < amount) {
            message.channel.send("You do not own enough of this share!");
            return;
        }

        // If it exists, remove one from the db.
        if (shareInDb) {
            shareInDb.amount -= amount;
            shareInDb.save();
        }
    
        // Complain if the user does not have the share.
        else {
            message.channel.send("You do not own this share!");
            return;
        }

        // Add money of share to user.
        message.client.currency.add(message.author.id, share.currentPrice * amount);

        // Send congratulations message to let the user know that something actually happened.
        message.channel.send(`You sold ${amount} ${share.name} for ${share.currentPrice * amount}<:ripcoin:929759319296192543>!`);

        const currentAmountBought = share.amountBought;
        const newAmount = currentAmountBought - amount;

        await Stocks.update({ amountBought: newAmount }, { where: { id: share.id } });

        const stockPrice = parseInt(share.currentPrice);
        const newStockPrice = stockPrice - amount;
        
        await Stocks.update({ oldPrice: share.currentPrice }, { where: { id: share.id } });
        await Stocks.update({ currentPrice: newStockPrice }, { where: { id: share.id } });
    }
};
