const { UserProfiles, FightMoves } = require(`${__basedir}/db_objects`);
const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require("discord.js");

const { gravestone } = require(`${__basedir}/emojis.json`);

async function makeFightEmbed(channel, playerOne, playerTwo, attacker, attackerMove, fightMessage) {
    const embed = new MessageEmbed({
        title: `*${playerOne.username}* VS *${playerTwo.username}*!`,

        description: `${attacker.username} ${attackerMove || "No moves have been made!"}`,

        fields: [
            {
                name: `${playerOne.username}`,
                value: `HP: ${playerOne.hp} | Mana ${playerOne.mana}`
            },
            {
                name: `${playerTwo.username}`,
                value: `HP: ${playerTwo.hp} | Mana ${playerTwo.mana}`
            },
        ],

        color: "33a5ff"
    });

    if (fightMessage !== null) return await fightMessage.edit({ embeds: [embed] });

    return channel.send({ embeds: [embed] });
} 

async function promptOptions(channel, user, promptMessage, options) {
    const rows = [];

    let index = 0;
    for (let i = 0; i < Math.min(Math.ceil(options.length / 25), 5); ++i) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId(`dropdown${i}`)
                    .addOptions(options.slice(index, index + 25).map((option, j) => {
                        return {label: `${index + j + 1}. ${option}`, value: (index + j).toString()};
                    }))
            );
        rows.push(row);
        index += 25;
    }

    const message = await channel.send({
        content: promptMessage,
        components: rows
    });

    const filter = interaction => interaction.user.id === user.id;
    // max time for collector is below (but reduced it to 60 seconds)
    //const collector = message.createMessageComponentCollector({filter, time: 2_147_483_647});
    const collector = message.createMessageComponentCollector({filter, time: 60000});

    return new Promise((resolve, reject) => {
        collector.on("end", () => {
            reject(new Error("no option chosen"));

            message.delete();
        });

        collector.on("collect", async interaction => {
            resolve(Number.parseInt(interaction.values[0]));

            rows.forEach(row => {
                row.components[0].options.forEach(option => {
                    option.default = false;
                });
            });
            rows[Math.floor(Number.parseInt(interaction.values[0]) / 25)].components[0].options[Number.parseInt(interaction.values[0]) % 25].default = true;

            await interaction.update({components: rows});
            collector.stop();
        });
    });
}

async function characterExists(user_id) {
    const userInDb = await UserProfiles.findOne({
        where: {
            user_id: user_id
        }
    }) || null;

    if (userInDb === null) return false;

    else return true;
}

async function isUsernameTaken(username) {
    const nameInDb = await UserProfiles.findOne({
        where: {
            username: username
        }
    }) || null;

    if (nameInDb === null) return false;

    else return true;
}

async function endGame(channel, client, winner, loser, userBet) {
    const winEmbed = {
        description: `${await client.users.fetch(winner.user_id)} wins the battle!`,
        
        fields: [
            {
                name: "Prize money (What your opponent lost)",
                value: `+${userBet}${gravestone}`
            }
        ],

        color: "33a5ff"
    };

    client.currency.add(winner, userBet);
    client.currency.add(loser, -userBet);
    
    return channel.send({ embeds: [winEmbed] });
}

async function promptMove(channel, user, promptMessage, moveArray) {
    const moves = [];
    console.log(moveArray);

    for (let i = 0; i < moveArray.length; ++i) {
        const moveInDb = await FightMoves.findOne({
            where: {
                name: `${moveArray[i]}`
            }
        }) || null;

        console.log(moveArray[i]);

        if (moveInDb === null) return;

        moves.push(moveInDb);

    }

    const optionChosen = await promptOptions(channel, user, promptMessage, moves.map(move => `${move.name} | Cost: ${move.cost} mana | Power: ${move.power}`)).catch((error) => {return console.log(error);});

    const attack = await FightMoves.findOne({
        where: {
            name: `${moveArray[optionChosen]}`
        }
    });

    return attack;
}

async function doAttack(channel, client, attacker, defender) {
    let looping = true;
    while (looping === true) {
        //console.log(await client.users.fetch(attacker.user_id));
        const attack = await promptMove(channel, await client.users.fetch(attacker.user_id), "Which move will you use?", attacker.moveset.split(", "));

        if (attack.cost > attacker.mana) {
            const noMana = await channel.send("You don't have enough mana for that!");
            setTimeout(async () => {
                await noMana.delete();
            }, 2000);
              
            looping = false;
            return false;
        } else {
            defender.hp -= parseInt(attack.power);
            attacker.mana -= parseInt(attack.cost);

            looping = false;
            return attack;
        }
    }
}

async function useItem(channel, client, attacker, itemType) {
    if (attacker.used_potions >= 10) {
        const noPotions = await channel.send(`${await client.users.fetch(attacker.user_id)}, you've already used all the potions you can!`);
        setTimeout(async () => {
            await noPotions.delete();
        }, 2000);

        return false;
    }

    attacker[itemType] += 4;

    attacker.used_potions += 1;

    return true;
}

async function doTurn(channel, client, attacker, defender, userBet) {
    let looping = true;
    while (looping === true) {
        const fightOptionChosen = await promptOptions(channel, await client.users.fetch(attacker.user_id), `${await client.users.fetch(attacker.user_id)}, what will you do?`, [
            "Attack",
            "Heal",
            "Mana",
            "Forfeit"
        ]).catch(async () => {
            looping = false;
            await endGame(channel, client, defender, attacker, userBet);
            
            return false;
        });
    
        if (fightOptionChosen === 0) {
            const attack = await doAttack(channel, client, attacker, defender);
    
            if (attack === false) continue;

            if (defender.hp <= 0) {
                await endGame(channel, client, attacker, defender, userBet);

                looping = false;
                //returning false means attacker won
                return false;
            }

            looping = false;
            return `used ${attack.name}!`;
        }
    
        else if (fightOptionChosen === 1) {
            const action = await useItem(channel, client, attacker, "hp");
            
            if (action === false) continue;

            looping = false;
            return "used a healing potion!";
        }
    
        else if (fightOptionChosen === 2) {
            const action = await useItem(channel, client, attacker, "mana");
   
            if (action === false) continue;

            looping = false;
            return "used a mana potion!";
        }   

        else if (fightOptionChosen === 3) {
            looping = false;
            await endGame(channel, client, defender, userBet);
            
            return false;
        }
    }
}


module.exports = {
    isUsernameTaken,
    characterExists,
    promptMove,
    makeFightEmbed,
    doTurn,
};