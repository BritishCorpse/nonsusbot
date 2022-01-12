const { Op } = require("sequelize");
const { Users } = require(`${__basedir}/db_objects`);
const { Stocks } = require(`${__basedir}/db_objects`);
const { circularUsageOption } = require(`${__basedir}/functions`);
const { UserPortfolio } = require(`${__basedir}/db_objects`);

module.exports = {
    name: "sellshare",
    description: "Buy shares from the stock market!",
    usage: [
        circularUsageOption(
            { tag: "item", checks: {matches: {not: /[^\w?!.,;:'"()]/}, isempty: {not: null}} }
        )
    ],
    async execute(message, args ){

        const share = await Stocks.findOne({
            where: {
                name: {
                    [Op.like]: args.join(" ")
                }
            }
        });

        // Find the share in the users portfolio.
        const shareInDb = await UserPortfolio.findOne({
            where: { user_id: message.author.id, share_id: share.id}
        });
    
        // Check for share amount, if 0 complain that they dont have the share..
        if (shareInDb.amount < 1) {
            message.channel.send("You do not own this share!");
            return;
        }
        // If it exists, remove one from the db.
        if (shareInDb) {
            shareInDb.amount -= 1;
            shareInDb.save();
        }
        
        // Complain if the user does not have the share.
        else {
            message.channel.send("You do not own this share!");
            return;
        }

        // Add money of share to user.
        message.client.currency.add(message.author.id, share.currentPrice);

        message.channel.send(`You sold 1 ${share.name} for ${share.currentPrice}<:ripcoin:929759319296192543>!`);
    }
};