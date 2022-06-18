const { makeBJEmbed, inputText, doBJTurn, giveCard, gameEnd, makeDealer, doDealerTurn } = require(`${__basedir}/utilities/gameFunctions.js`);

const { userCurrency } = require(`${__basedir}/db_objects`);

module.exports = {
    async execute(graveyard, interaction, playerList) {
        let inGame = true;

        const dealer = await makeDealer();

        const gameMessage = await interaction.channel.send({ embeds: [ await makeBJEmbed(playerList, dealer) ] });

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
                        interaction.channel.send({ embeds: [ await gameEnd(graveyard, playerList, dealer) ] });

                        dealerLoop = false;
                        continue;
                    } else if (dealerTurn === "pass") {
                        await gameMessage.edit({ embeds: [ await makeBJEmbed(playerList, dealer) ] });
                        interaction.channel.send({ embeds: [ await gameEnd(graveyard, playerList, dealer) ] });

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
                    let userBet = await inputText(interaction.channel, turnHolder.user, `${turnHolder.user} What will your bet be?`, 30).catch(() => {
                        turnHolder.bust = true;

                        tryForBet = false;
                    });

                    if (userBet === "max") userBet = userCurrency.getBalance(turnHolder.user.id);

                    if (isNaN(userBet) || userBet < 1 || userBet === Infinity) continue;

                    if (turnHolder.bet > await userCurrency.getBalance(turnHolder.user.id)) {
                        interaction.channel.send("You can't bet more than you have!");
                        continue;
                    }

                    turnHolder.bet = await userBet;

                    //give the user 2 cards
                    turnHolder.cards.push(await giveCard());
                    turnHolder.cards.push(await giveCard());

                    await gameMessage.edit({ embeds: [ await makeBJEmbed(playerList, dealer) ] });

                    tryForBet = false;
                    continue;
                }
            }

            let turnLoop = true;
            while (turnLoop === true) {
                const playerTurn = await doBJTurn(interaction.channel, turnHolder);

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
    }
};