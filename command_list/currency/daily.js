const { Users } = require(`${__basedir}/db_objects`);

const { gravestone } = require(`${__basedir}/emojis.json`); 

module.exports = {
    name: ["daily"],
    description: "Claim your daily coins!",
    usage: [],
    
    async execute(message){
        const user = message.author;

        const d = new Date();
        const time = d.getTime();

        const dailyMoney = 2000;

        //Find the target in the database.
        const userInDb = await Users.findOne({
            where: {user_id: user.id}
        }) || null; // this makes it an empty object if it is null


        //If they've never claimed daily, make it possible to claim daily, and update the database.
        if (userInDb.lastDaily === null) {
            await Users.update({ lastDaily: time - 86400000 }, { where: { user_id: message.author.id } });
        }   

        //Date
        const date = new Date((parseInt(userInDb.lastDaily) + 86400000)).toUTCString();

        //If theyre too early to claim daily.
        if (time - 86400000 < userInDb.lastDaily) {
            const embed = {
                title: `You can't claim your daily reward yet.\nPlease wait until ${date}`,
    
                author: {
                    name: "Bank Assistant",
                    icon_url: `${message.client.user.avatarURL()}`,
                    url: "https://talloween.github.io/graveyardbot/",
                },
        
                color: "RED",
    
                timestamp: new Date(),
        
                footer: {
                    text: "Powered by Graveyard",
                },
            };
            message.channel.send({ embeds: [embed] });
            return;
        }

        //Crashes with bots so this is acheck to see if the user running is a bot.
        if(user.bot) {
            message.channel.send("Bots cannot be ranked!");
            return;
        }

        if (userInDb === null) {
            message.channel.send("This user was not found.");
            return;
        }

        // this is just how many coins the user has
        const userBalance = userInDb.balance;

        //their rank if they have one   
        let userRank;
        if (userInDb.rank) {
            userRank = userInDb.rank;
        }

        const embed = {
            author: {
                name: "Bank Assistant",
                icon_url: `${message.client.user.avatarURL()}`,
                url: "https://talloween.github.io/graveyardbot/",
            },

            fields: [
                {
                    name: "Daily Reward",
                    value: `${dailyMoney}${gravestone}`
                },

                {
                    name: "Total Balance",
                    value: `${userBalance}${gravestone}`
                },

                {
                    name: "Rank",
                    value: `${userRank || "None"}`
                }
            ],

            color: "GREEN",

            timestamp: new Date(),
    
            footer: {
                text: "Powered by Graveyard",
            },
        };

        message.client.currency.add(message.author.id, dailyMoney);
        await Users.update({ lastDaily: time }, { where: { user_id: message.author.id } });

        message.channel.send({ embeds: [embed], allowedMentions: {user: true} });
    }
};
