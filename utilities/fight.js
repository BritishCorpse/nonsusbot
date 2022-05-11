const { UserProfiles, FightMoves } = require(`${__basedir}/db_objects`);
const { MessageActionRow, MessageSelectMenu } = require("discord.js");

const opponents = {
    margaret: {
        username: "Margaret",
        hp: 10,
        strength: 2,
        defence: 2,
        health_potions: 3,
        mana_potions: 3,
        level: null,
        xp: 10,
        moveset: "Bag swipe, Brick throw, Complain loudly, Misunderstand technology, Bite, Kick",
        special_ability: "Chew hard candy"
    }
};

const specialMoves = {
    Healer: {
        affects: "hp",
        effectiveness: 10,
        requiredMana: 10,
    },

    Rage: {
        affects: "strength",
        posNeg: "+",
        effectiveness: 5,
        requiredMana: 10,
    }
};

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

async function promptMove(channel, user, promptMessage, moveArray) {
    const moves = [];

    for (let i = 0; i < moveArray.length; ++i) {
        const moveInDb = await FightMoves.findOne({
            where: {
                name: `${moveArray[i]}`
            }
        }) || null;

        if (moveInDb === null) return;

        moves.push(moveInDb);

    }

    const optionChosen = await promptOptions(channel, user, promptMessage, moves.map(move => `${move.name} | Cost: ${move.cost} mana | Power: ${move.effectiveness} | Affects: ${move.affect}`)).catch(() => {return;});

    return moveArray[optionChosen];
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

module.exports = {
    isUsernameTaken,
    characterExists,
    opponents,
    specialMoves,
    promptMove
};