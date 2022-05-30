const { makeGameInviteEmbed, resolveGameInvite, makeBJEmbed, makePlayerObjectList, inputText, doBJTurn, giveCard, gameEnd, makeDealer, doDealerTurn } = require(`${__basedir}/utilities`);

module.exports = {
    name: "blackjack",
    description: "Host a game of blackjack!",
    usage: [],
    async execute(message) {
        const inviteMessage = await message.channel.send({ embeds: [ await makeGameInviteEmbed(message.author, "Blackjack") ] });
        inviteMessage.react("✅");

        const inviteWaitPeriod = 25 * 1000;

        let playerList;

        setTimeout(async () => {
            const messageReaction = await inviteMessage.reactions.resolve("✅");

            playerList = await resolveGameInvite(messageReaction);
            playerList = await makePlayerObjectList(message.client, playerList);

            if (playerList.length > 24) return message.channel.send("That's too many people!");
            if (playerList.length < 1) return message.channel.send("No one wants to play? :(");

            let inGame = true;

            const dealer = await makeDealer();

            const gameMessage = await message.channel.send({ embeds: [ await makeBJEmbed(playerList, dealer) ] });

            let turnHolder;
            let moveIteration = 0;

            while (inGame === true) { 
                if (moveIteration > playerList.length - 1) {
                    let dealerLoop = true;
                    while (dealerLoop === true) {
                        setTimeout(() => {
                        }, 2000);

                        const dealerTurn = await doDealerTurn(dealer);

                        await gameMessage.edit({ embeds: [ await makeBJEmbed(playerList, dealer) ] });

                        if (dealerTurn === "bust") {
                            dealer.username = `🚫BUST🚫${dealer.username}`;
                            dealer.bust = true;

                            await gameMessage.edit({ embeds: [ await makeBJEmbed(playerList, dealer) ] });
                            message.channel.send({ embeds: [ await gameEnd(message.client, playerList, dealer) ] });

                            dealerLoop = false;
                            continue;
                        } else if (dealerTurn === "pass") {
                            await gameMessage.edit({ embeds: [ await makeBJEmbed(playerList, dealer) ] });
                            message.channel.send({ embeds: [ await gameEnd(message.client, playerList, dealer) ] });

                            dealerLoop = false;
                            continue;
                        } else {
                            continue;
                        }
                    }

                    inGame = false;
                    return;
                }

                turnHolder = playerList[moveIteration];

                if (turnHolder.bet < 1) {
                    let tryForBet = true;
                    while (tryForBet === true) {
                        let userBet = await inputText(message.channel, turnHolder.user, `${turnHolder.user} What will your bet be?`, 30).catch(() => {
                            turnHolder.bust = true;

                            tryForBet = false;
                        });

                        if (userBet === "max") userBet = message.client.currency.getBalance(turnHolder.user.id);

                        if (isNaN(userBet) || userBet < 1 || userBet === Infinity) continue;

                        if (turnHolder.bet > await message.client.currency.getBalance(turnHolder.user.id)) {
                            message.channel.send("You can't bet more than you have!");
                            continue;
                        }

                        turnHolder.bet = await userBet;

                        //give the user a card
                        turnHolder.cards.push(await giveCard());

                        await gameMessage.edit({ embeds: [ await makeBJEmbed(playerList, dealer) ] });

                        tryForBet = false;
                        continue;
                    }
                }

                let turnLoop = true;
                while (turnLoop === true) {
                    const playerTurn = await doBJTurn(message.channel, turnHolder);
    
                    if (playerTurn === "bust") {
                        turnHolder.username = "🚫BUST🚫" + turnHolder.user.username;
                        turnHolder.bust = true;

                        turnLoop = false;
                    } else if (playerTurn === "pass") {
                        turnLoop = false;
                    }
    
                    await gameMessage.edit({ embeds: [ await makeBJEmbed(playerList, dealer) ] });        
                }
                
                //disable for infinite game;
                moveIteration++;
                //for testing, disable in real use.
                //inGame = false;
            }
        }, inviteWaitPeriod);
    }
};