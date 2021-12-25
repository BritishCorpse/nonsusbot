const fs = require("fs");
const defaultServerConfig = require("../default_server_config.json");
const { MessageEmbed } = require("discord.js");


module.exports = {
  name: "config",
  category: "Configuration",
  description: "Change server settings for this bot.",
  execute (message, args) {
    if (!message.member.permissionsIn(message.channel).has("ADMINISTRATOR")) {
      message.channel.send("You do not have the required permissions.");
      return
    }

    const client = message.client;
    
    if (args[0] === "set") {
      if (args[1] in defaultServerConfig) {
        // special cases for each config option
        // (return; in case of error)

        if (args[1] === "m_channel_id") {
          const channel = message.guild.channels.cache.get(args[2]);
          if (args[2] !== undefined && (channel === undefined || channel.type !== "text")) {
            message.channel.send("Channel ID is invalid");
            return;
          }
        }

        else if (args[1] === "verify_channel_id") {
          const channel = message.guild.channels.cache.get(args[2]);
          if (args[2] !== undefined && (channel === undefined || channel.type !== "text")) {
            message.channel.send("Channel ID is invalid");
            return;
          }

          channel.send("Say 'yes' if you agree with the rules, and get verified!");
          message.channel.send("Verify channel was setup. Edit the role to give using the config command, and manually edit the roles.");
        }

        else if (args[1] == "verify_role_id") {
          const role = message.guild.roles.cache.get(args[2]);
          if (args[2] !== undefined && role === undefined) {
            message.channel.send("Role ID is invalid");
            return;
          }
        }

        else if (args[1] == "vip_role_id") {
          const role = message.guild.roles.cache.get(args[2]);
          if (args[2] !== undefined && role === undefined) {
            message.channel.send("Role ID is invalid");
            return;
          }
        }
        
        else if (args[1] === "prefix") {
          if (args[2] === "" || args[2] === undefined || args[2].length > 3) {
            message.channel.send("Prefix is invalid");
            return;
          }
        }

        client.serverConfig.get(message.guild.id)[args[1]] = args[2];

        // write it to the file
        // TODO: replace this with shared function to write to server_config.json
        let serverConfigJSON = {};
        for (const [key, value] of client.serverConfig) {
          serverConfigJSON[key] = value;
        }
        fs.writeFile("./server_config.json", JSON.stringify(serverConfigJSON), err => console.error);

        message.channel.send("Set value `" + args[1] + "` to `" + args[2] + "`");
      } else {
        message.channel.send("The value `" + args[1] + "` doesn't exist")
      }

    } else if (args[0] === "list") {
      let descriptionString = "";
      let config = client.serverConfig.get(message.guild.id);
      for (const key in defaultServerConfig) {
        let value;
        if (config[key] === "" || config[key] === undefined) {
          value = "not defined";
        } else {
          value = config[key];
        }
        
        descriptionString += `${key}: \`${value}\`\n`;
      }

      const embed = new MessageEmbed()
        .setTitle("Configs for " + message.guild.name)
        .setColor("BLUE")
        .setDescription(descriptionString);

      message.channel.send({embeds: [embed]});

    } else {
      message.channel.send("Options are: set, list");
    }
  }
}
