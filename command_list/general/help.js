const { MessageEmbed } = new require("discord.js");


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
                    embedDescription += `**${command.name}**: `;
                } else { // if it has multiple names (aliases)
                    embedDescription += `**${command.name.join(", ")}**: `;
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
            let embedDescription = "";
            for (const category in categories) {
                embedDescription += `**${category}**\n`;
            }

            const embed = new MessageEmbed()
                .setColor("ORANGE")
                .setThumbnail(botAvatarUrl)
                .setTitle("Categories")
                .setDescription(embedDescription)
                .setFooter(`Do ${prefix}help <category> to see the commands in each category.`);

            message.channel.send({embeds: [embed]});
            
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
                    .addField('Category', command.category);

                // Format embed title
                if (typeof command.name === "string") {
                    embed.setTitle(`**${command.name}`);
                } else { // if it has multiple names (aliases)
                    embed.setTitle(`**${command.name.join(", ")}**`);
                }

                message.channel.send({embeds: [embed]});
            }
        }
    }
}
