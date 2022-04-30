const { Users } = require(`${__basedir}/db_objects`);
const { UserPortfolio } = require(`${__basedir}/db_objects`);
const { getUserItems } = require(`${__basedir}/utilities`);

const { userMention } = require("@discordjs/builders");

const { gravestone } = require(`${__basedir}/emojis.json`); 
module.exports = {
    name: ["networth"],
    description: "See your, or someone else's net worth!",
    
    usage: [
        { tag: "user", checks: {isuseridinguild: null} },
        { tag: "nothing", checks: {isempty: null} }
    ],
    async execute(message) {

        //Define some basic stuff like the target, and find the user in the database.
        const user = message.mentions.users.first() || message.author;

        const userInDb = await Users.findOne({ where: {user_id: user.id }});

        if(!userInDb) {
            message.channel.send("User was not found!");
            return;
        }   

        //Check the users balance.
        const userBalance = message.client.currency.getBalance(user.id);
        
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
        
        const shares = await getUserShares(user.id);

        let portfolioWorth = 0;

        if (shares.length === 0) {
            portfolioWorth = 0;
        }

        for (let i = 0; i < shares.length; ++i) {
            if (shares.amount <= 0) {continue;}

            portfolioWorth += parseInt(shares[i].shares.currentPrice * shares[i].amount);
        }
        
        //Calculate items worth.
        let itemsWorth = 0;

        const items = await getUserItems(user.id);

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

        // cool badge to show next to the user if they have one
        let userBadge;
        if (userInDb.badge) {
            userBadge = userInDb.badge;
        }

        //their rank if they have one   
        let userRank;
        if (userInDb.rank) {
            userRank = userInDb.rank;
        }

        const embed = {
            description: `${userBadge || ""}${userMention(user.id)}'s net worth`,

            author: {
                name: "Bank Assistant",
                icon_url: `${message.client.user.avatarURL()}`,
                url: "https://talloween.github.io/graveyardbot/",
            },

            fields: [
                {
                    name: "Total Net Worth",
                    value: `${calculatedNetworth}${gravestone}`
                },
                {
                    name: "Bank Balance",
                    value: `${userBalance}${gravestone}`
                },

                {
                    name: "Portfolio Worth",
                    value: `${portfolioWorth}${gravestone}`
                },

                {
                    name: "Inventory Worth", 
                    value: `${itemsWorth}${gravestone}`
                },

                {
                    name: "Rank",
                    value: `${userRank || "None"}`
                }
            ],

            color: "33a5ff",

            timestamp: new Date(),
    
            footer: {
                text: "Powered by Graveyard",
            },
        };

        message.channel.send({ embeds: [embed] });
    }
};

