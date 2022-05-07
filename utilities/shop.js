const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { CurrencyShop, Stocks, UserItems } = require(`${__basedir}/db_objects`);
const { Op } = require("sequelize");

async function shopOptions(channel, user, promptMessage, options) {
    const rows = [];
    rows.length = 0;

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

            rows.forEach(row => {
                row.components[0].setDisabled(true);
            });
            message.edit({components: rows});
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
async function promptStock(channel, user, promptMessage) {
    const shares = await Stocks.findAll({}) || null;

    if (shares === null) return channel.send("No stocks were found.");

    const optionChosen = await shopOptions(channel, user, promptMessage, shares.map(share => share.displayName)).catch(() =>  {return;});

    return shares[optionChosen];
}

async function promptBuy(channel, user, category, promptMessage) {
    const items = await CurrencyShop.findAll({
        where: {
            category: category
        }
    }) || null;

    if (items === null) {
        await channel.send("There are no items");
        return;
    }

    const optionChosen = await shopOptions(channel, user, promptMessage, items.map(item => item.name)).catch(() =>  {return;});

    return items[optionChosen];
}

async function promptItem(channel, user, promptMessage) {
    const items = await UserItems.findAll({
        where: {
            user_id: user.id
        }
    }) || null;

    const itemArray = [];

    for (let i = 0; i < items.length; ++i) {
        const item = await CurrencyShop.findOne({
            where: {
                id: {
                    [Op.like]: items[i].item_id
                }
            }
        }) || null;

        if (item === null) continue;

        itemArray.push(`${item.name}`);
    }


    if (items === null) {
        await channel.send("You have no items.");
        return;
    }

    const optionChosen = await shopOptions(channel, user, promptMessage, itemArray).catch(() => {return;});

    return items[optionChosen];
}


module.exports = {
    shopOptions,
    promptBuy,
    promptStock,
    promptItem
};