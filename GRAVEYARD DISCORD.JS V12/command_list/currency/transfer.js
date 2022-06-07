const { Users } = require(`${__basedir}/db_objects`);

const { userMention } = require("@discordjs/builders");

const { gravestone } = require(`${__basedir}/emojis.json`); 

module.exports = {
    name: ["transfer"],
    description: "Transfer coins from your account to someone else's.",

    usage: [
        { tag: "user", checks: {isuseridinguild: null},
            next: [
                { tag: "amount", checks: {ispositiveinteger: null} }
            ]
        }
    ],

    async execute (message, args) {
        const user = message.mentions.users.first();
        const transferTarget = user; // args[0]

        //Find the target in the database.
        const userInDb = await Users.findOne({
            where: {user_id: user.id}
        }) || {}; // this makes it an empty object if it is null

        const authorInDb = await Users.findOne({
            where: {user_id: message.author.id}
        }) || {}; // this makes it an empty object if it is null

        //Crashes with bots so this is acheck to see if the user running is a bot.
        if(user.bot) {
            message.channel.send("Bots cannot be ranked!");
            return;
        } 

        const currentAmount = message.client.currency.getBalance(message.author.id);
        //const transferAmount = commandArgs.split(/ +/).find(arg => !/<@!?\d+>/.test(arg));
        const transferAmount = args[1];

        // Do checks to see if the money can actually be transferred
        if (transferTarget.bot) return message.channel.send(`Sorry ${message.author.username}, you cannot give money to bot accounts.`);
        if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
        if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author} you don't have that much.`);
        if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);

        message.client.currency.add(transferTarget.id, transferAmount);
        await message.client.currency.add(message.author.id, -transferAmount); // only need to await this one to show the correct number in the message

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
            description: "Transfer Form",

            author: {
                name: "Bank Assistant",
                icon_url: `${message.client.user.avatarURL()}`,
                url: "https://talloween.github.io/graveyardbot/",
            },

            fields: [
                {
                    name: "Sum",
                    value: `${transferAmount}${gravestone}`
                },

                {
                    name: "Sender",
                    value: `${userBadge || ""}${userMention(user.id)}`
                },

                {
                    name: "Recipient",
                    value: `${userMention(transferTarget.id)}`
                },

                {
                    name: "Remaning Balance",
                    value: `${authorInDb.balance}${gravestone}`
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

        //Send the message
        message.channel.send({ embeds: [embed] });
    }
};
