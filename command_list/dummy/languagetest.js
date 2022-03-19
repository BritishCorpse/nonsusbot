const { translateForGuild } = require(`${__basedir}/functions`);


module.exports = {
    name: "languagetest",
    description: "test translations",
    developer: true,

    usage: [
    ],

    async execute (message) {
        message.channel.send(translateForGuild(message.guild, "Each participant attempts to beat the dealer by getting a count as close to 21 as possible, without going over 21.\nThe player to the left goes first and must decide whether to \"stand\" (not ask for another card) or \"hit\" (ask for another card in an attempt to get closer to a count of 21, or even hit 21 exactly). Thus, a player may stand on the two cards originally dealt to them, or they may ask the dealer for additional cards, one at a time, until deciding to stand on the total (if it is 21 or under), or goes \"bust\" (if it is over 21). In the latter case, the player loses and the dealer collects the bet wagered. The dealer then turns to the next player to their left and serves them in the same manner.\nWhen the dealer has served every player, the dealers face-down card is turned up. If the total is 17 or more, it must stand. If the total is 16 or under, they must take a card. The dealer must continue to take cards until the total is 17 or more, at which point the dealer must stand. If the dealer has an ace, and counting it as 11 would bring the total to 17 or more (but not over 21), the dealer must count the ace as 11 and stand. The dealer's decisions, then, are automatic on all plays, whereas the player always has the option of taking one or more cards.\nThe maximum bet for this gamemode is 25 million 💰's."));
    }
};
