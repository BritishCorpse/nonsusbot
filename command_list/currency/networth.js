const { MessageEmbed } = require("discord.js");
const { Users } = require(`${__basedir}/db_objects`);
const { UserPortfolio } = require(`${__basedir}/db_objects`);
const { getUserItems } = require(`${__basedir}/functions`);

module.exports = {
    name: "networth",
    description: "See your, or someone else's net worth!",
    
    usage: [
        { tag: "user", checks: {isuseridinguild: null} },
        { tag: "nothing", checks: {isempty: null} }
    ],
    async execute(message) {

        //Define some basic stuff like the target, and find the user in the database.
        const target = message.mentions.users.first() || message.author;
        const randomColor = Math.floor(Math.random()*16777215).toString(16);

        const userInDb = await Users.findOne({ where: {user_id: target.id }});

        if(!userInDb) {
            message.channel.send("User was not found!");
            return;
        }   

        //Check the users balance.
        const userBalance = message.client.currency.getBalance(target.id);
        
        //Find all the shares of the user, then calculate the worth of the shares.
        async function getUserShares(userId) {

            // Gets the porfolio of the user
            const portfolio = await UserPortfolio.findAll({
                where: {
                    user_id: userId
                },
                include: ["shares"]
            });

            if (portfolio === null)
                return [];

            return portfolio;
        }
        
        const shares = await getUserShares(target.id);

        let portfolioWorth = 0;

        if (shares.length === 0) {
            portfolioWorth = 0;
        }

        for (let i = 0; i < shares.length; ++i) {
            if (shares.amount <= 0) {continue;}

            portfolioWorth += parseInt(shares[i].shares.currentPrice * shares[i].amount);
            console.log(portfolioWorth);
        }
        
        //Calculate items worth.
        let itemsWorth = 0;

        const items = await getUserItems(target.id);

        if (items.length === 0) {
            itemsWorth = 0;
        }

        for (let i = 0; i < items.length; ++i) {
            const item = items[i];

            if (item.amount === 0) {continue;}
            
            itemsWorth += parseInt(items[i].item.cost * items[i].amount);
            console.log(itemsWorth);
        }
        //Total calculated networth.
        const calculatedNetworth = portfolioWorth + parseInt(userBalance) + parseInt(itemsWorth);

        const embed = new MessageEmbed()
            .setTitle(`${userInDb.badge || " "} ${target.username}'s net worth!`)
            .setColor(randomColor)
            .setDescription(`Total net worth: ${calculatedNetworth}<:ripcoin:929759319296192543>`)
            .addField("RipCoin:", `${userBalance}<:ripcoin:929759319296192543>`)
            .addField("Portfolio worth:", `${portfolioWorth}<:ripcoin:929759319296192543>`)
            .addField("Inventory worth:", `${itemsWorth}<:ripcoin:929759319296192543>`);

        message.channel.send({ embeds: [embed] });
    }
};