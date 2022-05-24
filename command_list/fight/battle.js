const { UserProfiles } = require(`${__basedir}/db_objects`);

const { inputText } = require(`${__basedir}/utilities`); 

const { errorMessages, sendErrorMessage, makeFightEmbed, doTurn } = require(`${__basedir}/utilities`);

module.exports = {
    name: "battle",
    description: "Challenge another player to a battle!",
    usage: [
        { tag: "user", checks: {isuseridinguild: null}}
    ],
    async execute(message) {
        const mentionedUser = message.mentions.users.first();
        if (mentionedUser.bot) return await sendErrorMessage(message.channel, message.author, errorMessages.botsNotAllowed);
        //if (mentionedUser === message.author) return await sendErrorMessage(message.channel, message.author, errorMessages.selfMention);

        // find both players in the database.
        const playerOne = await UserProfiles.findOne({ where: { user_id: message.author.id } }) || null;
        const playerTwo = await UserProfiles.findOne({ where: { user_id: message.mentions.users.first().id } }) || null;

        if (playerOne === null || playerTwo === null) {
            return await sendErrorMessage(message.channel, message.author, errorMessages.userNotFound);
        }   

        // send the offer in the chat and await for the response
        const battleOffer = await inputText(message.channel, message.author, `${message.mentions.users.first()} you are challenged to a battle by ${message.author}! Will you accept? (yes/no)`, 20).catch(async () => {
            return;
        });

        // sick ass guard clause
        if (!battleOffer || battleOffer !== "yes") return await sendErrorMessage(message.channel, message.author, errorMessages.declined);

        // both players start with 1 mana point
        playerOne.mana = 1;
        playerTwo.mana = 1;

        playerOne.used_potions = 0;
        playerTwo.used_potions = 0;

        // fightMessage is an embed that displays information about the game, such as players HP, mana etc.
        // this gets called at the end of a users move.
        const fightMessage = await makeFightEmbed(message.channel, playerOne, playerTwo, playerOne, null, null);

        let attacker = playerOne;
        let defender = playerTwo;

        let looping = true;
        while (looping === true) {
            const attackerMove = await doTurn(message.channel, message.client, attacker, defender); 

            // this means the attacker won
            if (!attackerMove) looping = false;

            await makeFightEmbed(message.channel, playerOne, playerTwo, attacker, attackerMove, fightMessage);

            // at the end of the round swap who's attacking and who's defending.
            [attacker, defender] = [defender, attacker];

            // give both the attacker and the defender 1 mana point at the end of the round.
            attacker.mana += 1;
            defender.mana += 1;

            // DEVELOPMENT THING. remove when finalized.
            //looping = false;
        }
    }
};