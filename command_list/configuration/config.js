const fs = require("fs");
const { MessageEmbed } = require("discord.js");
const defaultServerConfig = require(`${__basedir}/default_server_config.json`);
const functions = require(`${__basedir}/functions`);


module.exports = {
  name: "config",
  description: "Change server settings for this bot.",
  userPermissions: ["ADMINISTRATOR"],
  execute (message, args) {
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
        functions.saveServerConfig(client.serverConfig);

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
