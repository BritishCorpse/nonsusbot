const request = require("request");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'geoip',
  description: "Geolocates an IP. The IP address should be the first argument.",
  execute (message, args) {
    var randomColor = Math.floor(Math.random()*16777215).toString(16);
    
    const ipExpr = /(?:\d{1,3}\.){3}\d{1,3}/;

    let valid = ipExpr.test(args[0]);

    args[0].split(".").forEach(num => {
      if (parseInt(num) > 255) {
        valid = false; 
      }
    });

    if (!valid) {
      message.channel.send("Please enter a valid IP address.");
      return;
    }

    request("https://ipinfo.io/" + args[0], (error, response, body) => {
      //console.error(error);
      let embed = new MessageEmbed()
        .setTitle(args[0])
        .setURL("https://ipinfo.io/" + args[0])
        .setThumbnail("https://i.postimg.cc/8zR8F27F/ipinfo-io-logo.png")
        .setColor(randomColor);

      bodyString = "";
      for (const value in JSON.parse(body)) {
        if (value === "ip" || value === "readme") continue;

        bodyString += value[0].toUpperCase() + value.slice(1) + ": " + JSON.parse(body)[value] + "\n";
      }
      embed.setDescription(bodyString);
      
      message.channel.send({embeds: [embed]});
    });
  }
}
