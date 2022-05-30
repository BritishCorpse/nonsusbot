const { MessageEmbed } = require("discord.js");
const { userHasItem, sendErrorMessage, errorMessages } = require(`${__basedir}/utilities`);

const { gravestone, redgembadge } = require(`${__basedir}/emojis.json`);

async function throwDice() {
    return Math.floor(Math.random() * 6 + 1);
}

async function gameEmbed(userDiceOne, userDiceTwo, botDiceOne, botDiceTwo) {
    return new MessageEmbed({
        title: "A game of dice!",

        fields: [
            {
                name: "You rolled!",
                value: `${userDiceOne}${redgembadge} & ${userDiceTwo}${redgembadge}`
            },

            {
                name: "The computer rolled!",
                value: `${botDiceOne}${redgembadge} & ${botDiceTwo}${redgembadge}`
            }
        ],

        color: "GREEN"
    });
}

async function endGame(client, channel, author, winLoss, userBet) {
    if (winLoss === "win") {
        await channel.send(`You win! +${userBet}${gravestone}`);

        await client.currency.add(author.id, userBet * 2);
    }

    else if (winLoss === "loss") {
        await channel.send(`You lose! -${userBet}${gravestone}`);
    }

    else if (winLoss === "draw") {
        await channel.send("Its a draw!");

        await client.currency.add(author.id, userBet);
    }
}

module.exports = {
    name: ["dice"],
    description: "Play against the computer in a game of dice.",

    usage: [
        { tag: "bet", checks: {ispositiveinteger: null} },
        { tag: "rules", checks: {is: "rules"} }
    ],

    async execute(message, args){
        const prefix = message.client.serverConfig.get(message.guild.id).prefix;

        // check for casino membership
        if (!await userHasItem(message.author.id, "Casino Membership")) {
            message.channel.send(`You don't have a casino membership. See the ${prefix}shop to buy it.`);
            return;
        }

        const user = message.author;
        const userBet = args[0];

        if (userBet > message.client.currency.getBalance(user.id)) return await sendErrorMessage(errorMessages.notEnoughMoney);

        await message.client.currency.add(user.id, -userBet);

        const userDiceOne = await throwDice();
        const userDiceTwo = await throwDice();

        const botDiceOne = await throwDice();
        const botDiceTwo = await throwDice();

        const userTotal = userDiceOne + userDiceTwo;
        const botTotal = botDiceOne + botDiceTwo;

        await message.channel.send({ embeds: [await gameEmbed(userDiceOne, userDiceTwo, botDiceOne, botDiceTwo)] });

        if (userTotal > botTotal) return await endGame(message.client, message.channel, message.author, "win", userBet);
        else if (botTotal > userTotal) return await endGame(message.client, message.channel, message.author, "loss", userBet);
        else return await endGame(message.client, message.channel, message.channel, message.author, "draw", userBet);
    }
};
