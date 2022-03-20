const { MessageEmbed } = require("discord.js");
const {
    getCommandCategories,
    getAllCommandNames,
    getCommandObjectByName,
    getSimilarities,
    getAllUsagePaths,
    paginateEmbeds,
    formatBacktick,
} = require(`${__basedir}/functions`);
const developmentConfig = require(`${__basedir}/development_config.json`);


function formatCategoryName(category) {
    return category.toLowerCase().replace(/^\w/, c => c.toUpperCase());
}


module.exports = {
    name: "oldhelp",
    description: "What you're reading right now!",

    usage: [
        { tag: "nothing", checks: {isempty: null} },
        { tag: "category",
            checks: {
                passes: {
                    func: arg => {
                        if (!arg) return false;
                        return getCommandCategories().includes(arg.toLowerCase());
                    },
                    description: () => "is a category"
                }
            }
        },
        { tag: "command",
            checks: {
                passes: {
                    func: (arg, message) => {
                        return message.client.commands.find(c => {
                            if (typeof c.name === "string") {
                                if (arg === c.name) return true;
                            } else if (typeof c.name === "object") {
                                if (c.name.includes(arg)) return true;
                            }
                            return false;
                        }) !== undefined;
                    },
                    description: () => "is a command"
                }
            }
        }
    ],

    async execute (message, args) {
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        const prefix = message.client.serverConfig.get(message.guild.id).prefix;
        const botAvatarUrl = message.client.user.displayAvatarURL();

        // Create categories dictionary with all the commands
        const categories = {};
        message.client.commands.each(command => {
            const category = formatCategoryName(command.category);
            if (!Object.prototype.hasOwnProperty.call(categories, category)) {
                categories[category] = [];
            }

            categories[category].push(command);
        });

        function commandShouldNotBeShown(commandObject) {
            // Only show developer commands to developers in the development servers
            return commandObject.developer === true
                   && !(developmentConfig.developer_discord_user_ids.includes(message.author.id)
                        && developmentConfig.development_discord_server_ids.includes(message.guild.id));
        }

        function createEmbedFromCategory(category) {
            let embedDescription = "";
            for (const command of categories[formatCategoryName(category)]) {
                if (commandShouldNotBeShown(command)) {
                    continue;
                }

                if (typeof command.name === "string") {
                    embedDescription += `${formatBacktick(prefix + command.name)}: `;
                } else { // if it has multiple names (aliases)
                    embedDescription += `${command.name.map(n => formatBacktick(prefix + n)).join(", ")}: `;
                }
                embedDescription += command.description + "\n";
            }

            if (embedDescription.length === 0) {
                embedDescription = "None of the commands in this category can be shown to you!";
            }

            return new MessageEmbed()
                .setColor(randomColor)
                .setThumbnail(botAvatarUrl)
                .setTitle(formatCategoryName(category))
                .setDescription(embedDescription);
        }

        // Show help in different ways (all categories, just one category, or just one command)

        // List all categories (no argument given)
        if (args[0] === undefined || args[0] === "") {
            const pages = [];

            let mainEmbedDescription = "";
            for (const category in categories) {
                mainEmbedDescription += `**${category}**\n`;

                pages.push(createEmbedFromCategory(category));
            }

            pages.unshift(new MessageEmbed()
                .setColor(randomColor)
                .setThumbnail(botAvatarUrl)
                .setTitle("Categories")
                .setDescription(mainEmbedDescription)
                .setFooter({text: `Do ${prefix}help <category> to see the commands in each category.`})
            );

            paginateEmbeds(message.channel, message.author, pages, {useButtons: false, useDropdown: true});
        } else {
            const possibleCategory = formatCategoryName(args[0]);
            if (Object.prototype.hasOwnProperty.call(categories, possibleCategory)) {
                // One category given
                message.channel.send({embeds: [createEmbedFromCategory(possibleCategory)]});
            } else {
                // One command given
                const commandName = args[0].replace(/^_/, "");

                const command = getCommandObjectByName(message.client.commands, commandName);

                if (commandShouldNotBeShown(command)) {
                    message.channel.send("This command cannot be shown to you!");
                    return;
                }
                
                if (command === undefined) {
                    const topCommands = getSimilarities(commandName, getAllCommandNames(message.client.commands))
                        .filter(match => match.similarity < 3);

                    message.channel.send(`The command ${prefix}${commandName} was not found. Did you mean: ${topCommands.map(c => c.formatBacktick()).join(", ")}?`);
                    return;
                }

                const embed = new MessageEmbed()
                    .setColor(randomColor)
                    .setThumbnail(botAvatarUrl)
                    .setDescription(command.description)
                    .addField("Category", formatCategoryName(command.category));
                
                // Format embed title
                if (typeof command.name === "string") {
                    embed.setTitle(formatBacktick(prefix + command.name));
                } else { // if it has multiple names (aliases)
                    embed.setTitle(command.name.map(n => formatBacktick(prefix + n)).join(", "));
                }

                if (command.userPermissions !== undefined)
                    embed.addField("Permissions required", "`" + command.userPermissions.join("`, `") + "`");

                if (command.developer === true)
                    embed.setFooter({text: "This command is only available to developers."});

                // Show usage
                const paths = getAllUsagePaths(command.usage); // all possible argument combinations
                
                let usageString = "";
                for (const path of paths) {
                    usageString += path.map(tag => formatBacktick(`<${tag}>`)).join(" ");
                    usageString += "\n";
                }
                if (usageString.length > 0)
                    embed.addField("Usage", usageString);

                message.channel.send({embeds: [embed]});
            }
        }
    }
};
