const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const { Op } = require('sequelize');

const { Users, CurrencyShop } = require(`${__basedir}/db_objects`)


function addPageNumbersToFooter(embed, page, maxPage) {
    return new MessageEmbed(embed).setFooter(`(${page}/${maxPage}) ${embed.footer.text}`);
}


function collectionToJSON(collection) {
    // turns a discord collection to a JSON {key: value} dictionary
    let result = {};
    for (const [key, value] of collection) {
        result[key] = value;
    }
    return result;
}

async function getUserItems(userId) {
    const user = await Users.findOne({
        where: {
            user_id: userId
        }
    });

    if (user === null) {
        return [];
    }

    const items = await user.getItems();
    return items;
}


module.exports = {
    getUserItems,

    async userHasItem(userId, itemName) {
        /*const item = await CurrencyShop.findOne({
            where: {
                name: {
                    [Op.like]: itemName
                }
            }
        });*/

        const userItems = await getUserItems(userId);

        if (userItems.find(userItem => userItem.item.name === itemName) !== undefined)
            return true;

        return false;
    },

    saveServerConfig (serverConfig) {
        // Saves the client.serverConfig (given in argument as serverConfig) to server_config.json
        fs.writeFile(`${__basedir}/server_config.json`, JSON.stringify(collectionToJSON(serverConfig)),
                     error => {
                         if (error !== null) console.error(error);
                     });
    },

    async paginateEmbeds (channel, allowedUser, embeds, messageToEdit=null, previousEmoji='◀️', nextEmoji='▶️', addPagesInFooter=true, timeout=120000) {
        // Idea from https://www.npmjs.com/package/discord.js-pagination
        // Creates reactions allowing multiple embed pages

        // channel is the channel to send to
        // allowedUser is the user who can flip the pages
        // if messageToEdit is given, it will edit that message instead of sending a new one
        // if addPagesInFooter is true, it adds page number before the footer


        let maxIndex = embeds.length - 1;
        let currentIndex = 0;

        let message;

        if (messageToEdit === null) {
            let newEmbed = embeds[currentIndex];
            if (addPagesInFooter)
                newEmbed = addPageNumbersToFooter(newEmbed, currentIndex + 1, maxIndex + 1);

            message = await channel.send({embeds: [newEmbed]});
        } else {
            message = messageToEdit;
        }

        // Put the emojis
        message.react(previousEmoji).then(() => {
            message.react(nextEmoji);
        });

        const filter = (reaction, user) => (reaction.emoji.name === previousEmoji
                                            || reaction.emoji.name === nextEmoji)
                                           && user.id === allowedUser.id;

        const collector = message.createReactionCollector({filter, time: timeout});

        collector.on('collect', reaction => {
            if (reaction.emoji.name === previousEmoji) {
                if (currentIndex === 0)
                    currentIndex = maxIndex; // loop back around
                else
                    currentIndex--; 
            } else if (reaction.emoji.name === nextEmoji) {
                if (currentIndex === maxIndex)
                    currentIndex = 0;
                else
                    currentIndex++;
            }

            let newEmbed = embeds[currentIndex];
            if (addPagesInFooter)
                newEmbed = addPageNumbersToFooter(newEmbed, currentIndex + 1, maxIndex + 1);

            message.edit({embeds: [newEmbed]});
            message.reactions.resolve(reaction.emoji.name).users.remove(allowedUser);
        });
    }
}
