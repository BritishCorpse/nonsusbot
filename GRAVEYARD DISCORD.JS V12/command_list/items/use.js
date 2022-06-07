const { Op } = require("sequelize");
const { CurrencyShop, UserItems, Levels, Users } = require(`${__basedir}/db_objects`);
const { circularUsageOption } = require(`${__basedir}/utilities`);



module.exports = {
    name: ["use"],
    description: "Use an item from your inventory.",

    usage: [
        circularUsageOption(
            { tag: "item", checks: {matches: {not: /[^\w?!.,;:'"()]/}, isempty: {not: null}} }
        )
    ],

    async execute (message, args) {
        // Functions for the usage system.
        function scrumptiousnessLevel() {
            const randInt = Math.floor(Math.random() * 10);

            const itemCost = item.cost;

            if (randInt === 0) {
                return ("It wasn't edible! +0 EXP.");
            }

            else if (randInt < 10) {
                userLevel.exp += itemCost +5;
                userLevel.save();
                return (`It was decent! +${itemCost+5} EXP.`);
            } 

            else if (randInt === 10) {
                userLevel.exp += 50;
                userLevel.save();
                return (`It was SCRUMPTIOUS! +${itemCost+10} EXP.`);
            }
        }

        //Find the users level in the database.
        const userLevel = await Levels.findOne({
            where: {userId: message.author.id, guildId: message.guild.id}
        }); 

        if (!userLevel) {
            await Levels.create({
                userId: message.author.id, guildId: message.guild.id  
            });
        }

        // Find the item in the curerncyshop.
        const item = await CurrencyShop.findOne({
            where: {
                name: {
                    [Op.like]: args.join(" ")
                }
            }
        });

        if (!item) return message.channel.send("That item doesn't exist.");

        // Find the item in the users inventory.
        const itemInDb = await UserItems.findOne({
            where: { user_id: message.author.id, item_id: item.id}
        });
        
        // Check if the item is in the inventory.
        if (!itemInDb || itemInDb.amount < 1) {
            message.channel.send("You do not own this item!");
            return;
        }
        
        // Usage elif chain :)
        if (item.category === "Food") {
            const scrumptious = scrumptiousnessLevel();

            message.channel.send(`You ate the food! ${scrumptious}.`);
            itemInDb.amount -= 1;
            itemInDb.save();
        }

        else if (item.category === "Badges") {
            message.channel.send("Your new badge has been applied!");

            await Users.update({ badge: item.itemEmoji }, { where: { user_id: message.author.id } });
        }


    }
};
