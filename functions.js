const fs = require('fs');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const { Op } = require('sequelize');
const { Users, CurrencyShop } = require(`${__basedir}/db_objects`);


const descriptionFormats = {
    isempty: not => `is ${not ? "not " : ""}empty`,
    is: (not, value) => `is ${not ? "not " : ""}\`${value}\``,
    isin: (not, value) => `is ${not ? "not " : ""}one of \`${value.join(", ")}\``,
    isinteger: not => `is ${not ? "not " : ""}an integer`,
    matches: (not, value) => `${not ? "does not match" : "matches"} \`\`\`${value}\`\`\``,
    matchesfully: (not, value) => `${not ? "does not match" : "matches"} fully \`\`\`${value}\`\`\``,
};



function addPageNumbersToFooter(embed, page, maxPage) {
    return new MessageEmbed(embed).setFooter(`(${page}/${maxPage}) ${embed.footer ? embed.footer.text : ''}`);
}


function collectionToJSON(collection) {
    // turns a discord collection to a JSON {key: value} dictionary
    let result = {};
    for (const [key, value] of collection) {
        result[key] = value;
    }
    return result;
}


function getCommandCategories() {
    return fs.readdirSync(`${__basedir}/command_list`);
}


async function getUserItems(userId) {
    const user = await Users.findOne({
        where: {
            user_id: userId
        }
    });

    if (user === null)
        return [];

    return await user.getItems();
}


async function userHasItem(userId, itemName) {
    const item = await CurrencyShop.findOne({
        where: {
            name: {
                [Op.like]: itemName
            }
        }
    });

    const userItems = await getUserItems(userId);

    //if (userItems.find(userItem => userItem.item.name === itemName) !== undefined)
    if (userItems.find(userItem => userItem.item.item_id === item.item_id) !== undefined)
        return true;
    return false;
}


function saveServerConfig(serverConfig) {
    // Saves the client.serverConfig (given in argument as serverConfig) to server_config.json
    fs.writeFile(`${__basedir}/server_config.json`, JSON.stringify(collectionToJSON(serverConfig)),
                 error => {
                     if (error !== null) console.error(error);
                 });
}


async function paginateEmbeds(channel, allowedUser, embeds, messageToEdit=null, previousEmoji='<', nextEmoji='>', addPagesInFooter=true, timeout=120000) {
    // Idea from https://www.npmjs.com/package/discord.js-pagination
    // Creates reactions allowing multiple embed pages

    // channel is the channel to send to
    // allowedUser is the user who can flip the pages
    // if messageToEdit is given, it will edit that message instead of sending a new one
    // if addPagesInFooter is true, it adds page number before the footer

    let maxIndex = embeds.length - 1;
    let currentIndex = 0;

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('previous')
                .setLabel(previousEmoji)
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('next')
                .setLabel(nextEmoji)
                .setStyle('PRIMARY')
        );

    let message;
    if (messageToEdit === null) {
        let newEmbed = embeds[currentIndex];
        if (addPagesInFooter)
            newEmbed = addPageNumbersToFooter(newEmbed, currentIndex + 1, maxIndex + 1);

        message = await channel.send({embeds: [newEmbed], components: [row]});
    } else {
        message = messageToEdit;
    }

    const filter = interaction => (interaction.customId === 'previous'
                                   || interaction.customId === 'next')
                                  && interaction.user.id === allowedUser.id;

    const collector = message.createMessageComponentCollector({filter, time: timeout});

    collector.on('collect', interaction => {
        if (interaction.customId === 'previous') {
            if (currentIndex === 0)
                currentIndex = maxIndex; // loop back around
            else
                currentIndex--; 
        } else if (interaction.customId === 'next') {
            if (currentIndex === maxIndex)
                currentIndex = 0;
            else
                currentIndex++;
        }

        let newEmbed = embeds[currentIndex];
        if (addPagesInFooter)
            newEmbed = addPageNumbersToFooter(newEmbed, currentIndex + 1, maxIndex + 1);

        interaction.update({embeds: [newEmbed]});
    });

    collector.on('end', collected => {
        row.components.forEach(button => button.setDisabled(true));
        message.edit({components: [row]});
    });
}


function generateDescription(option) {
    let description = "";

    // Generate a description from the checks
    for (const check in option.checks) {
        let value = option.checks[check];
        const not = value && value.hasOwnProperty("not");
        if (not) {
            value = value.not;
        }

        if (check !== "passes") {
            description += descriptionFormats[check](not, value);
        } else {
            if (!option.checks[check].description) {
                throw { 
                    name:        "CommandUsageError", 
                    message:     `There is no description for ${check}.`, 
                    toString:    function() {return `${this.name}: ${this.message}`;}
                };
            }
            description += option.checks[check].description(not, value);
        }
        description += "\n";
    }

    if (option.hasOwnProperty("example")) {
        description += `**Example**: ${option.example}`;
    }

    return description;
}


function sendUsage(message, usage, failedOn, failedArg) {
    // TODO: if failedOn is null, it will show the complete usage
    if (failedOn === undefined) failedOn = usage;

    const embed = new MessageEmbed()
        .setTitle("Incorrect Usage")
        .setFooter(`Use ${message.client.serverConfig.get(message.guild.id).prefix}help for more information.`);

    if (failedArg === null)
        embed.setDescription("Your usage is wrong.")
    else if (failedArg === undefined)
        embed.setDescription("You are missing an argument. The argument can be:");
    else
        embed.setDescription(`\`${failedArg}\` is an invalid argument. The argument can be:`);

    for (const option of failedOn)
        embed.addField(`<${option.tag}>`, generateDescription(option));

    message.reply({embeds: [embed]});
}


function getValidationFunction(message, check, _value) {
    // Returns a validation function from a check name
    const validationFunctions = {
        isempty: arg => [undefined, ""].includes(arg),
        is: arg => arg === value,
        isin: arg => value.includes(arg),
        isinteger: arg => {
            if (!arg) return false;
            const match = arg.match(/^-?\d+/);
            if (match !== null && match[0] === arg) {
                // check that it is not too big or too big negatively
                const n = Number.parseInt(match[0]);
                return n.toString() !== "Infinity" && n.toString() !== "-Infinity";
            }
            return false;
        },
        matches:  arg => {
            if (!arg) return false;
                return arg.match(value) !== null;
        },
        matchesfully:  arg => {
                if (!arg) return false;
                const match = arg.match(value);
                return match !== null && match[0] === arg;
        },
    }

    let value;
    let invert = false;
    if (_value && _value.hasOwnProperty("not")) {
        value = _value.not;
        invert = true;
    } else {
        value = _value;
    }

    let validationFunction;
    if (check === "passes"){
        validationFunction = value.func; 
        validationFunction = arg => {
            // value.func is a custom function
            // give it the message so that it can check more
            return value.func(arg, message);
        };
    } else {
        if (!validationFunctions.hasOwnProperty(check)) {
            throw { 
                name:        "CommandUsageError", 
                message:     `There is no check called ${check}.`, 
                toString:    function() {return `${this.name}: ${this.message}`;}
            };
        } else {
            validationFunction = validationFunctions[check];
        }
    }

    return arg => {
        if (invert) return !validationFunction(arg);
        return validationFunction(arg);
    };
}


function checkUsage(message, usage, args, depth=0) {
    // recursive function
    // Returns true if it passed, object if it didn't
    // depth determines which args index to use

    if (usage.length === 0) return true; // nothing to check

    const passedOptions = []; // if usage is made correctly, there should only be one correct option

    for (const option of usage) {
        let passed = true;

        // option must pass all checks defined
        for (const check in option.checks) {
            const validationFunction = getValidationFunction(message, check, option.checks[check]);

            if (validationFunction(args[depth]) !== true) {
                passed = false;
            }
        }
        
        if (passed) {
            passedOptions.push(option);
        }
    }

    if (passedOptions.length === 1) {
        // success

        // depth < args.length allows for infinite (circular) objects for infinite arguments being checked
        if (depth < args.length && passedOptions[0].hasOwnProperty("next")) { 
            return checkUsage(message, passedOptions[0].next, args, depth + 1);
        }
        return true;
    } else if (passedOptions.length === 0) {
        // fail; return the usage for which it failed
        return [usage, depth];
    } else {
        // error
        throw { 
            name:        "CommandUsageError", 
            message:     "There cannot be multiple valid usages.", 
            toString:    function() {return `${this.name}: ${this.message}`;}
        };
    }
}


function doCommand(commandObj, message, args) {
    let pass;
    if (!commandObj.usage) {
        throw { 
            name:        "CommandUsageError", 
            message:     `There is no usage defined for ${commandObj.name}.`, 
            toString:    function() {return `${this.name}: ${this.message}`;}
        };
    }
    pass = checkUsage(message, commandObj.usage, args);

    if (pass !== true) {
        const [usage, depth] = pass;
        sendUsage(message, commandObj.usage, usage, args[depth]);
    } else {
        commandObj.execute(message, args);
    }
    /*try {
    } catch (error) {
        console.error(error.toString());
        message.reply("There was an error trying to execute that command!");
    }*/

    /*if (pass !== true) {
        const [usage, depth] = pass;
        sendUsage(message, commandObj.usage, usage, args[depth]);
    } else {
        try {
            commandObj.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply("There was an error trying to execute that command!");
        }
    }*/
}


module.exports = {
    collectionToJSON,
    getCommandCategories,
    getUserItems,
    userHasItem,
    saveServerConfig,
    paginateEmbeds,
    sendUsage,
    checkUsage,
    doCommand,
}
