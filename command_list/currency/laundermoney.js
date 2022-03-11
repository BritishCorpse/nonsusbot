const { MessageEmbed } = require("discord.js");

module.exports = {
    name: ["laundermoney", "launder", "lm"],
    description: "Launder money and get up to 100 thousan<:ripcoin:929759319296192543>! But beware, there is a high chance of being caught!",
    usage: [],
    async execute(message) {      
        const amount = Math.floor(Math.random() * 5000) + 150000;

        const failOrSuccess = Math.floor(Math.random() * 6);

        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        if (failOrSuccess === 0) {
            const embed = new MessageEmbed()
                .setTitle("You succeeded!")
                .setColor(randomColor)
                .setDescription(`You evaded to police and laundered ${amount}<:ripcoin:929759319296192543>!`);
            
            message.reply({embeds: [embed]});
            message.client.currency.add(message.author.id, amount);
        }

        else {
            const embed = new MessageEmbed()
                .setTitle("You failed!")
                .setColor(randomColor)
                .setDescription(`You were caught by the police and paid ${amount - 50000}<:ripcoin:929759319296192543> in fines!`);
            
            message.reply({embeds: [embed]});
        }
    }
};