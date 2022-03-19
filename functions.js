const fs = require("fs");
const { URL } = require("url");
const levenshtein = require("js-levenshtein");
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const { Op } = require("sequelize");
const i18n = require("i18n");

const { Users, CurrencyShop } = require(`${__basedir}/db_objects`);


const descriptionFormats = {
    isempty: not => `is ${not ? "not " : ""}empty`,
    is: (not, value) => `is ${not ? "not " : ""}${formatBacktick(value)}`,
    isin: (not, value) => `is ${not ? "not " : ""}one of ${value.map(formatBacktick).join(", ")}`,
    isinteger: not => `is ${not ? "not " : ""}an integer`,
    ispositiveinteger: not => `is ${not ? "not " : ""}a positive integer`,
    isnegativeinteger: not => `is ${not ? "not " : ""}a negative integer`,
    isintegerbetween: (not, value) => `is ${not ? "not " : ""}an integer between ${formatBacktick(value[0])} and ${formatBacktick(value[1])}`,
    matches: (not, value) => `${not ? "does not match" : "matches"} ${formatBacktick(value)}`,
    matchesfully: (not, value) => `${not ? "does not match" : "matches"} fully ${formatBacktick(value)}`,
    //isuserid: (not, value) => `is ${not ? "not " : ""}a user`,
    isbanneduseridinguild: not => `is ${not ? "not " : ""}a banned user in the guild`,
    isuseridinguild: not => `is ${not ? "not " : ""}a user id in the guild`,
    isurl: not => `is ${not ? "not " : ""}a url`,
};


function addPageNumbersToFooter(embed, page, maxPage) {
    return new MessageEmbed(embed).setFooter({text: `(${page}/${maxPage}) ${embed.footer ? embed.footer.text : ""}`});
}


function collectionToJSON(collection) {
    // turns a discord collection to a JSON {key: value} dictionary
    const result = {};
    for (const [key, value] of collection) {
        result[key] = value;
    }
    return result;
}


function getCommandCategories() {
    return fs.readdirSync(`${__basedir}/command_list`);
}


function getAllCommandNames(commandsCollection) {
    // returns all command names including aliases from a commands collection
    const allCommands = [];
    commandsCollection.forEach(commandObj => {
        if (typeof commandObj.name === "object") {
            for (const commandAlias of commandObj.name)
                allCommands.push(commandAlias);
        } else
            allCommands.push(commandObj.name);
    });
    return allCommands;
}


function getCommandObjectByName(commandsCollection, commandName) {
    return commandsCollection.find(command => {
        if (typeof command.name === "string" && commandName === command.name)
            return true;
        else if (typeof command.name === "object" && command.name.includes(commandName))
            return true;
        return false;
    });
}


function getSimilarities(inputString, array) {
    const matches = [];
    for (const string of array) {
        const similarity = levenshtein(inputString, string);
        matches.push({string, similarity});
    }
    return matches;
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
    if (userItems.find(userItem => userItem.item_id === item.id) !== undefined)
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


async function paginateEmbeds(channel, allowedUser, embeds, { useDropdown=false, useButtons=true, messageToEdit=null, previousEmoji="<", nextEmoji=">", addPagesInFooter=true, timeout=120000 }={}) {
    // Idea from https://www.npmjs.com/package/discord.js-pagination
    // Creates reactions allowing multiple embed pages

    // channel is the channel to send to
    // allowedUser is the user who can flip the pages
    // if messageToEdit is given, it will edit that message instead of sending a new one
    // if useDropdown is true, it shows a dropdown to switch pages
    // if useButtons is true, it shows buttons to switch pages (both useDropdown and useButtons can be set)
    // if addPagesInFooter is true, it adds page number before the footer

    const maxIndex = embeds.length - 1;
    let currentIndex = 0;

    const rows = [];

    let selectMenuRow;
    let buttonRow;

    if (embeds.length > 1) { // only add buttons and menu if it has more than one page
        if (useDropdown) {
            selectMenuRow = new MessageActionRow();
            const selectMenu = new MessageSelectMenu()
                .setCustomId("dropdown");

            embeds.forEach((embed, i) => {
                selectMenu.addOptions({
                    label: `Page ${i + 1}${embed.title ? `: ${embed.title}` : ""}`,
                    value: i.toString(),
                    default: i === 0
                });
            });

            selectMenuRow.addComponents(selectMenu);
            rows.push(selectMenuRow);
        }

        if (useButtons) {
            buttonRow = new MessageActionRow();
            buttonRow.addComponents(
                new MessageButton()
                    .setCustomId("previous")
                    .setLabel(previousEmoji)
                    .setStyle("PRIMARY"),
                new MessageButton()
                    .setCustomId("next")
                    .setLabel(nextEmoji)
                    .setStyle("PRIMARY")
            );
            rows.push(buttonRow);
        }
    }

    let message;
    if (messageToEdit === null) {
        let newEmbed = embeds[currentIndex];
        if (addPagesInFooter)
            newEmbed = addPageNumbersToFooter(newEmbed, currentIndex + 1, maxIndex + 1);

        message = await channel.send({embeds: [newEmbed], components: rows});
    } else {
        message = messageToEdit;
    }

    if (embeds.length === 1) return; // don't create filters/collectors if only one page

    const filter = interaction => (interaction.customId === "previous"
                                   || interaction.customId === "next"
                                   || interaction.customId === "dropdown")
                                  && interaction.user.id === allowedUser.id;

    const collector = message.createMessageComponentCollector({filter, time: timeout});

    collector.on("collect", interaction => {
        if (interaction.customId === "previous") {
            if (currentIndex === 0)
                currentIndex = maxIndex; // loop back around
            else
                currentIndex--; 
        } else if (interaction.customId === "next") {
            if (currentIndex === maxIndex)
                currentIndex = 0;
            else
                currentIndex++;
        } else if (interaction.customId === "dropdown") {
            currentIndex = Number.parseInt(interaction.values[0]);
        }

        if (useDropdown) {
            selectMenuRow.components[0].options.forEach(option => {
                option.default = false;
            });
            selectMenuRow.components[0].options[currentIndex].default = true;
        }

        let newEmbed = embeds[currentIndex];
        if (addPagesInFooter)
            newEmbed = addPageNumbersToFooter(newEmbed, currentIndex + 1, maxIndex + 1);

        interaction.update({embeds: [newEmbed], components: rows});
    });

    collector.on("end", () => {
        rows.forEach(row => {
            row.components.forEach(component => {
                component.setDisabled(true);
                if (component.type === "BUTTON")
                    component.setStyle("SECONDARY");
            });
        });

        message.edit({components: rows});
    });
}


function circularUsageOption(option) {
    if (Object.prototype.hasOwnProperty.call(option, "next"))
        option.next.push(option);
    else
        option.next = [option];
    option.circular = true;
    return option;
}


function formatBacktick(name) {
    return `\`\`${name}\`\``;
}


function getAllUsagePaths(usage) {
    const paths = [];

    for (const option of usage) {
        if (!option.circular && option.next) {
            const nextPaths = getAllUsagePaths(option.next);

            for (const nextPath of nextPaths)
                paths.push([option.tag, ...nextPath]);
        } else if (option.circular) {
            paths.push([`${option.tag}...`]);
        } else {
            paths.push([option.tag]);
        }
    }

    return paths;
}


function generateDescription(option) {
    let description = "";

    // Generate a description from the checks
    for (const check in option.checks) {
        let value = option.checks[check];
        const not = value && Object.prototype.hasOwnProperty.call(value, "not");
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

    if (Object.prototype.hasOwnProperty.call(option, "example")) {
        description += `**Example**: ${option.example}`;
    }

    return description;
}


function sendUsage(message, commandName, usage, failedOn, failedArg) {
    // TODO: if failedOn is null, it will show the complete usage
    if (failedOn === undefined) failedOn = usage;

    const prefix = message.client.serverConfig.get(message.guild.id).prefix;

    const embed = new MessageEmbed()
        .setTitle("Incorrect Usage")
        .setFooter({text: `Use ${prefix}help for more information.`});

    const paths = getAllUsagePaths(usage); // all possible argument combinations
    let description = "";
    for (const path of paths) {
        //description += `${formatBacktick(message.content.split(" ")[0])} `;
        description += `${formatBacktick(prefix + commandName)} `;
        description += path.map(tag => formatBacktick(`<${tag}>`)).join(" ");
        description += "\n";
    }
    description += "\n";

    if (failedArg === null)
        description += "Your usage is wrong.";
    else if (failedArg === undefined)
        description += "You are missing an argument. The argument can be:";
    else
        description += `${formatBacktick(failedArg || " ")} is an invalid argument. The argument can be:`;

    embed.setDescription(description);

    for (const option of failedOn)
        embed.addField(`<${option.tag}>`, generateDescription(option), true);

    message.reply({embeds: [embed]});
}


function getValidationFunction(message, check, _value) {
    let value;
    let invert = false;
    if (_value && Object.prototype.hasOwnProperty.call(_value, "not")) {
        value = _value.not;
        invert = true;
    } else {
        value = _value;
    }

    function isInteger(arg) {
        if (!arg) return false;
        const match = arg.match(/^-?\d+/);
        if (match !== null && match[0] === arg) {
            // check that it is not too big or too big negatively
            const n = Number.parseInt(match[0]);
            return n !== Infinity && n !== -Infinity;
        }
        return false;
    }

    // Returns a validation function from a check name
    const validationFunctions = {
        isempty: arg => [null, undefined, ""].includes(arg),
        is: arg => arg === value,
        isin: arg => value.includes(arg),
        isinteger: isInteger,
        ispositiveinteger: arg => {
            if (!isInteger(arg)) return false;
            return Number.parseInt(arg) > 0;
        },
        isnegativeinteger: arg => {
            if (!isInteger(arg)) return false;
            return Number.parseInt(arg) < 0;
        },
        isintegerbetween: arg => {
            if (!isInteger(arg)) return false;
            return Number.parseInt(arg) >= value[0] && Number.parseInt(arg) < value[1];
        },
        matches:  arg => {
            if (!arg) return false;
            return arg.match(value) !== null;
        },
        matchesfully: arg => {
            if (!arg) return false;
            const match = arg.match(value);
            return match !== null && match[0] === arg;
        },
        isbanneduseridinguild: async arg => {
            if (!arg) return false;
            let userId;
            if (arg.match(/^<@!\d+>$/) !== null)
                userId = arg.slice(3, -1);
            else if (arg.match(/^\d+$/))
                userId = arg;

            return await message.guild.bans.fetch(userId)
                .catch(error => {
                    if (error.name !== "DiscordAPIError")
                        throw error;
                }) !== undefined;
        },
        isuseridinguild: async arg => {
            if (!arg) return false;
            let userId;
            if (arg.match(/^<@!\d+>$/) !== null)
                userId = arg.slice(3, -1);
            else if (arg.match(/^\d+$/))
                userId = arg;

            return await message.guild.members.fetch(userId)
                .catch(error => {
                    if (error.name !== "DiscordAPIError")
                        throw error;
                }) !== undefined;
        },
        isurl: arg => {
            // from https://stackoverflow.com/questions/30931079/validating-a-url-in-node-js/55585593#55585593
            try {
                const url = new URL(arg);
                return url.protocol
                    ? ["http", "https"].map(x => `${x.toLowerCase()}:`).includes(url.protocol)
                    : false;
            } catch (error) {
                return false;
            }
        },
    };

    let validationFunction;
    if (check === "passes"){
        // value.func is a custom function
        validationFunction = arg => {
            return value.func(arg, message);
        }; 
    } else {
        if (!Object.prototype.hasOwnProperty.call(validationFunctions, check)) {
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


async function checkUsage(message, usage, args, depth=0) {
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

            if (await validationFunction(args[depth]) !== true) {
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
        if ((passedOptions[0].circular === true && depth < (args.length - 1))
            || (passedOptions[0].circular !== true && Object.prototype.hasOwnProperty.call(passedOptions[0], "next"))) { 
            return await checkUsage(message, passedOptions[0].next, args, depth + 1);
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
    if (!commandObj.usage) {
        throw { 
            name:        "CommandUsageError", 
            message:     `There is no usage defined for ${commandObj.name}.`, 
            toString:    function() {return `${this.name}: ${this.message}`;}
        };
    }

    checkUsage(message, commandObj.usage, args)
        .then(pass => {
            if (pass !== true) {
                const [usage, depth] = pass;
                sendUsage(message, typeof commandObj.name === "object" ? commandObj.name[0] : commandObj.name, commandObj.usage, usage, args[depth]);
            } else {
                commandObj.execute(message, args);
            }
        })
        .catch(error => {
            console.error(error.toString());
            console.trace();
            process.exit(1);
        });
}


function getLanguages() {
    return fs.readdirSync(`${__basedir}/locales`)
        .filter(file => file.endsWith(".json"))
        .map(file => file.slice(0, -5));
}


function translateForGuild(guild, string, replace=null) {
    // Translate a string for a guild's configs (this uses the translations in the ./locales folder)
    const language = guild.client.serverConfig.get(guild.id).language;

    return i18n.__({phrase: string, locale: language}, replace || undefined);
}


module.exports = {
    collectionToJSON,
    getCommandCategories,
    getAllCommandNames,
    getCommandObjectByName,
    getAllUsagePaths,
    getSimilarities,
    getUserItems,
    userHasItem,
    saveServerConfig,
    paginateEmbeds,
    sendUsage,
    checkUsage,
    doCommand,
    circularUsageOption,
    formatBacktick,
    getLanguages,
    translateForGuild,
};
