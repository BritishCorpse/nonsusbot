const { MessageEmbed } = require("discord.js");
const { paginateEmbeds } = require(`${__basedir}/functions`);


function formatCategoryName(category) {
    return category.toLowerCase().replace(/^\w/, c => c.toUpperCase());
}


module.exports = {
    name: 'help',
    description: "What you're reading right now!",
    execute (message, args) {
        const prefix = message.client.serverConfig.get(message.guild.id).prefix;
        const botAvatarUrl = message.client.user.displayAvatarURL();

        // Create categories dictionary with all the commands
        const categories = {};
        message.client.commands.each(command => {
            const category = formatCategoryName(command.category)
            if (!categories.hasOwnProperty(category)) {
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
                .setColor("ORANGE")
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
                           .setColor("ORANGE")
                           .setThumbnail(botAvatarUrl)
                           .setTitle("Categories")
                           .setDescription(mainEmbedDescription)
                           .setFooter(`Do ${prefix}help <category> to see the commands in each category.`)
            );

            paginateEmbeds(message.channel, message.author, pages);
        } else {
            const possibleCategory = formatCategoryName(args[0])
            if (categories.hasOwnProperty(possibleCategory)) {
                // One category given
                message.channel.send({embeds: [createEmbedFromCategory(possibleCategory)]});
            } else {
                // One command given
                let commandName = args[0].replace(/^_/, "");

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
                    .setColor("ORANGE")
                    .setThumbnail(botAvatarUrl)
                    .setDescription(command.description)
                    .addField('Category', formatCategoryName(command.category));
                
                if (command.userPermissions !== undefined)
                    embed.addField('Permissions required', '`' + command.userPermissions.join('`, `') + '`');

                if (command.developer === true) {
                    embed.setFooter('This command is only available to developers.');
                }

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
}
