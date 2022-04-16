const { Op } = require("sequelize");
const { CurrencyShop, UserItems, Levels, Users } = require(`${__basedir}/db_objects`);
const { circularUsageOption } = require(`${__basedir}/functions`);



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
            const randInt = Math.floor(Math.random() * 3);

            if (randInt === 0) {
                return ("It wasn't edible! +0 EXP.");
            }

            else if (randInt === 1) {
                userLevel.exp += 30;
                userLevel.save();
                return ("It was decent! +30 EXP.");
            } 

            else if (randInt === 2) {
                userLevel.exp += 100;
                userLevel.save();
                return ("It was SCRUMPTIOUS! +100 EXP.");
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
        if (!itemInDb) {
            message.channel.send("You do not own this item!");
            return;
        }
        
        // Check if amount is a positive integer, to prevent negative integers in the database.
        if (itemInDb.amount < 1) {
            message.channel.send("You do not own this item!");
            return;
        }


        // Remove 1 item from the user.
        /*
        itemInDb.amount -= 1;
        itemInDb.save();
        */
        
        // DO NOT REMOVE THE ITEM HERE REMOVE IT IN THE ELIF CHAIN.

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
