const { MessageEmbed } = require("discord.js");
const { getCommandCategories, paginateEmbeds } = require(`${__basedir}/functions`);


function formatCategoryName(category) {
    return category.toLowerCase().replace(/^\w/, c => c.toUpperCase());
}


module.exports = {
    name: "help",
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

    execute (message, args) {
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

        function createEmbedFromCategory(category) {
            let embedDescription = "";
            for (const command of categories[formatCategoryName(category)]) {
                if (typeof command.name === "string") {
                    embedDescription += `**${prefix}${command.name}**: `;
                } else { // if it has multiple names (aliases)
                    embedDescription += `**${prefix}${command.name.join(", " + prefix)}**: `;
                }
                embedDescription += command.description + "\n";
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
                .setFooter(`Do ${prefix}help <category> to see the commands in each category.`)
            );

            paginateEmbeds(message.channel, message.author, pages);
        } else {
            const possibleCategory = formatCategoryName(args[0]);
            if (Object.prototype.hasOwnProperty.call(categories, possibleCategory)) {
                // One category given
                message.channel.send({embeds: [createEmbedFromCategory(possibleCategory)]});
            } else {
                // One command given
                const commandName = args[0].replace(/^_/, "");

                const command = message.client.commands.find(c => {
                    if (typeof c.name === "string") {
                        if (commandName === c.name) {
                            return true;
                        }
                    } else {
                        if (c.name.includes(commandName)) {
                            return true;
                        }
                    }
                    return false;
                });
                
                if (command === undefined) {
                    message.channel.send(`The command ${prefix}${commandName} was not found.`);
                    return;
                }

                const embed = new MessageEmbed()
                    .setColor(randomColor)
                    .setThumbnail(botAvatarUrl)
                    .setDescription(command.description)
                    .addField("Category", formatCategoryName(command.category));
                
                if (command.userPermissions !== undefined)
                    embed.addField("Permissions required", "`" + command.userPermissions.join("`, `") + "`");

                if (command.developer === true)
                    embed.setFooter("This command is only available to developers.");

                // Format embed title
                if (typeof command.name === "string") {
                    embed.setTitle(`**${prefix}${command.name}**`);
                } else { // if it has multiple names (aliases)
                    embed.setTitle(`**${prefix}${command.name.join(", " + prefix)}**`);
                }

                message.channel.send({embeds: [embed]});
            }
        }
    }
};
