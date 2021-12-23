const fs = require("fs");
const { MessageEmbed } = new require("discord.js");


module.exports = {
    name: 'help',
    category: "General",
    description: "Help page for commands.",
    execute (message, args) {

        const prefix = message.client.serverConfig.get(message.guild.id).prefix;

        // Create categories dictionary with all the commands
        const categories = {};
        message.client.commands.each(command => {
            if (!categories.hasOwnProperty(command.category)) {
                categories[command.category] = [];
            }

            categories[command.category].push(command);
        });

        function createEmbedFromCategory(category) {
            let embedDescription = "";
            for (const command of categories[category]) {
                if (typeof command.name === "string") {
                    embedDescription += `**${command.name}**: `;
                } else { // if it has multiple names (aliases)
                    embedDescription += `**${command.name.join(", ")}**: `;
                }
                embedDescription += command.description + "\n";
            }

            return new MessageEmbed()
                .setColor("RED")
                .setTitle(category)
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
                .setColor("RED")
                .setTitle("Categories")
                .setDescription(embedDescription)
                .setFooter(`Do ${prefix}help <category> to see the commands in each category.`);

            message.channel.send(embed);
            
        } else {
            const possibleCategory = args[0].toLowerCase().replace(/^\w/, c => c.toUpperCase())
            if (categories.hasOwnProperty(possibleCategory)) {
                // One category given
                message.channel.send(createEmbedFromCategory(possibleCategory));
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
                    .setTitle(command.name)
                    .setColor("RED")
                    .setDescription(command.description)
                    .addField('Category', command.category);
                message.channel.send(embed);
            }
        }
    }
}
