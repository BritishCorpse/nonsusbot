const { MessageEmbed } = require("discord.js");
const { FightMoves } = require("../../db_objects");

const { UserProfiles } = require(`${__basedir}/db_objects`);

const { opponents, specialMoves } = require(`${__basedir}/utilities`);

const { promptOptions, fellAsleep, promptMove } = require(`${__basedir}/utilities`);

const { gravestone } = require(`${__basedir}/emojis.json`);

async function doSpecialMove(ability, userObject) {
    // use the given ability to find the actual ability in object called specialMoves.
    // we will use this keys values to do some cool math
    const specialAbility = specialMoves[ability];

    //check if they have enough mana for it
    if (userObject.mana < specialAbility.requiredMana) {
        return false;
    }

    //give the user the buff
    userObject[specialAbility.affects] += specialAbility.effectiveness;

    // remove the cost of the special ability
    userObject.mana -= specialAbility.requiredMana;

    return `+${specialAbility.effectiveness} ${specialAbility.affects}!`;
}


module.exports = {
    name: ["fight"],
    description: "Fight an opponent!",
    usage: [],
    async execute(message) {
        // cool function for when the game ends
        async function endGame(user, opponent) {
            const userInDb = await UserProfiles.findOne({
                where: {
                    user_id: message.author.id
                }
            }) || null;

            if (user.hp < 1) {
                const embed = new MessageEmbed({
                    title: `**BOT ${opponent.username}** wins!`,
                    
                    description: `${user.username} lost 3000 ${gravestone}'s!`
                });
        
                message.client.currency.add(user.user_id, -3000);
                return message.channel.send({ embeds: [embed] });
            }

            else if (opponent.hp < 1) {
                const winEmbed = new MessageEmbed({
                    title: `**${user.username}** wins!`,

                    description: `${user.username} won 3000 ${gravestone}'s!`,

                    fields: [
                        {
                            name: "You gained XP!",
                            value: `+${opponent.xp}`
                        }
                    ]
                });

                if (user.xp >= 100) {
                    if (userInDb.null) return;

                    userInDb.level += 1;
                    userInDb.xp = 0;

                    userInDb.save();
                    
                    message.channel.send("You leveled up!");

                    const levelUpEmbed = new MessageEmbed({
                        fields: [
                            {
                                name: "Strength",
                                value: `+${opponent.xp}`
                            },
                            {
                                name: "Defence",
                                value: `+${opponent.xp}`
                            }
                        ]
                    });

                    message.channel.send({ embeds: [levelUpEmbed] });
                }

                message.client.currency.add(userInDb.user_id, 3000);
                return message.channel.send({ embeds: [winEmbed] });
            }
        }

        const userInDb = await UserProfiles.findOne({
            where: {
                user_id: message.author.id
            }
        }) || null;

        if (userInDb === null) return message.channel.send("You have not created a profile.");

        message.channel.send(`Logged in as: \`${userInDb.username}\``);

        /* Getting a random opponent from the opponents object. */
        const opponentObject = Object.values(opponents)[Math.floor(Math.random() * Object.keys(opponents).length)];
        
        // make a user object so that we can easily manipulate these values, but not the ones in the database.
        const user = {
            username: userInDb.username,
            hp: userInDb.hp,
            startHp: userInDb.hp,
            strength: userInDb.strength,
            defence: userInDb.defence,
            health_potions: userInDb.health_potions,
            mana_potions: userInDb.mana_potions,            
            level: userInDb.level,            
            xp: userInDb.xp,  
            moveset: userInDb.moveset,
            special_ability: userInDb.special_ability,
            mana: 0,
            health_potions_used: 0,
            mana_potions_used: 0,
        };

        // grab all the information about the opponent, then assign it to an object. this allows for easy manipulation, without altering the original object
        const opponent = {
            username: opponentObject.username,
            hp: opponentObject.hp,
            startHp: opponentObject.hp + user.level,
            strength: opponentObject.strength + user.level,
            defence: opponentObject.defence + user.level,
            health_potions: opponentObject.health_potions + user.level,
            mana_potions: opponentObject.mana_potions + user.level,
            level: user.level,
            xp: opponentObject.xp + user.level,
            mana: 0,
            moveset: opponentObject.moveset,
            health_potions_used: 0,
            mana_potions_user: 0,
        };

        const embed = {
            title: "The battle begins!",

            description: `It's **${user.username}** against **BOT ${opponent.username}**!\n`,

            fields: [
                {
                    name: `${user.username}'s moves are`,
                    value: `${user.moveset}`
                },

                {
                    name: `${opponent.username}'s moves are`,
                    value: `${opponent.moveset}`
                },
            ]

        };

        message.channel.send({ embeds: [embed] });

        let lastAction = "";
        let lastLastAction = "";

        let turnHolder = user.username;

        let looping = true;

        async function fightEmbed(lastAction) {
            return new MessageEmbed({
                title: `${user.username} VS. ${opponent.username}`,

                description: `${opponent.username}'s move: **${lastAction || "No moves have been made yet!"}**\n\n${user.username}'s move: **${lastLastAction || "No moves have been made yet!"}**\n\nIt's ${turnHolder}'s turn!`,

                fields: [
                    {
                        name: `${opponent.username} | ${opponent.hp} HP | ${opponent.mana} Mana`,
                        value: `${opponent.defence} Defence | ${opponent.strength} Srength`
                    },
                    {
                        name: `${user.username} | ${user.hp} HP | ${user.mana} Mana`,
                        value: `${user.defence} Defence | ${user.strength} Strength `
                    },
                ]
            });
        }

        const fightMessage = await message.channel.send({ embeds: [await fightEmbed(lastAction)] });

        async function attackFunction(user, opponent, attack) {
            if (user.mana < attack.cost) return false;

            let attackPower = user.strength + attack.effectiveness;

            attackPower = attackPower - opponent.defence;

            console.log(attackPower);


            function doAttack(posNeg) {
                if (posNeg === "+") {
                    user[attack.affect] += attack.effectiveness;
                }

                else {
                    opponent[attack.affect] = opponent[attack.affect] - attackPower;
                }
            }

            console.log(`This had an affect of ${opponent[attack.affect]} ${attackPower}`);

            //check the target of the move. 
            //if its the user, all effects are positive, and if its the opponent, all effects are negative.
            if (attack.target === "self") {
                console.log(attack.target);
                doAttack("+");

                lastLastAction = lastAction;
                lastAction = `${user.username} used ${attack.name}!\nThey gained ${attack.effectiveness} ${attack.affect}`;
            }

            else {  
                console.log(attack.target);
                doAttack("-");

                lastLastAction = lastAction;
                lastAction = `${user.username} used ${attack.name}!\n${opponent.username} lost ${attackPower} ${attack.affect}`;
            }

            fightMessage.edit({ embeds: [await fightEmbed()] });
        }

        async function pickMove(opponent) {
            const moveset = opponent.moveset.split(", ");

            const randomMove = moveset[Math.floor(Math.random() * moveset.length)];

            return randomMove;
        }

        async function opponentTurn(opponent) {
            let turnLoop = true;
            while(turnLoop === true) {

                const randomMove = await pickMove(opponent);

                const move = await FightMoves.findOne({
                    where: {
                        name: randomMove,
                    }
                }) || null;

                if (move === null) continue;
                if (move.cost > opponent.mana) continue;

                // try to heal if hp is low, priority number dos
                if (opponent.hp < opponentObject.hp / 2) {
                    if (opponent.health_potions_used < 5) {
                        opponent.hp += 5;
    
                        opponent.health_potions_used += 1;

                        const availableHealth = 5 - opponent.health_potions_used;

                        lastLastAction = lastAction;
                        lastAction = `${opponent.username} used a healing potion! +5 health!\nThey can use ${availableHealth} more health potions!`;

                        turnLoop = false;

                        turnHolder = user.username;
                        continue;
                    } else {
                        continue;
                    }
                }

                // destroy kill the opponent BOOM. (jar jar binks episode 1 bim boomba)
                await attackFunction(opponent, user, move);
                turnLoop = false;

                turnHolder = user.username;
                continue;
            }

        }

        while(looping === true) {
            user.mana += 1;
            opponent.mana += 1;

            if (user.hp <= 1 || opponent.hp <= 1) {
                await endGame(user, opponent);
                looping = false;
                return;
            }

            if (turnHolder === opponent.username) {
                await opponentTurn(opponent);
            }

            fightMessage.edit({ embeds: [await fightEmbed(lastAction)] });

            const optionChosen = await promptOptions(message.channel, message.author, "What will you do?", [
                "Attack",
                "Heal",
                "Mana",
                "Special Ability",
            ]).catch(async () => {
                await fellAsleep(message.channel, message.author);
            });

            if (optionChosen === 0) {
                let attackLoop = true;
                while (attackLoop === true) {
                    const attackOption = await promptMove(message.channel, message.author, "What attack will you use?", user.moveset.split(", ")).catch(async (error) => {
                        console.log(error);
                        await fellAsleep(message.channel, message.author);
                    });

                    const attack = await FightMoves.findOne({
                        where: {
                            name: attackOption
                        }
                    }) || null;
    
                    if (attack === null) return message.channel.send("Move not found!");
    
                    //check if the user has enough mana to run to move
                    if (attack.cost > user.mana) {
                        message.channel.send("You don't have enough mana for that!");
                        continue;
                    }
    
                    await attackFunction(user, opponent, attack);
                    attackLoop = false;

                    turnHolder = opponent.username;
                }

                continue;
            }

            if (optionChosen === 1) {
                // if they dont have health potions
                if (user.health_potions < 0) {
                    message.channel.send("You don't have any more health potions!");
                    continue;
                }

                //maximum amount of health potions that you can use per battle is 10
                else if (user.health_potions_used >= 10) {
                    message.channel.send("You've used your maximum amount of health potions!");
                    continue;
                }

                else {
                    user.hp += 5;
                    user.health_potions -= 1;
                    user.health_potions_used += 1;

                    const availableHealth = 5 - user.health_potions_used;

                    lastLastAction = lastAction;
                    lastAction = `${user.username} used a healing potion! +5 health!\nThey can use ${availableHealth} more health potions!`;

                    turnHolder = opponent.username;
                    continue;
                }
            }

            if (optionChosen === 2) {
                // if they dont have mana potions
                if (user.mana_potions < 0) {
                    message.channel.send("You don't have any more mana potions!");
                    continue;
                }

                //maximum amount of health potions that you can use per battle is 10
                else if (user.mana_potions_used >= 5) {
                    message.channel.send("You've used your maximum amount of mana potions!");
                    continue;
                }   

                else {
                    user.mana += 3;
                    user.mana_potions -= 1;
                    user.mana_potions_used += 1;

                    const availableMana = 10 - user.health_potions_used;

                    lastLastAction = lastAction;
                    lastAction = `${user.username} used a mana potion! +3 mana!\nThey can use ${availableMana} more mana potions!`;

                    turnHolder = opponent.username;
                    continue;
                }
            }

            if (optionChosen === 3) {
                //call the function
                const specialResult = await doSpecialMove(user.special_ability, user);

                if (specialResult === false) {
                    message.channel.send("You don't have enough mana for that!");
                    continue;
                }

                lastLastAction = lastAction;
                lastAction = `${user.username} used their special move! ${specialResult}`;

                turnHolder = opponent.username;
                continue;
            }

            looping = false;
        }
    }   
};