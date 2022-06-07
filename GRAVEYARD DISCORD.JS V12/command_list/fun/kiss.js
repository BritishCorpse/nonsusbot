const { MessageEmbed } = require("discord.js");


module.exports = {
    name: ["kiss"],
    description: "Kiss whoever you'd like to.",

    usage: [
        { tag: "user", checks: {isuseridinguild: null}, example: "786301097953591326" }
    ],

    async execute(message) {
        const randomColor = Math.floor(Math.random()*16777215).toString(16);

        const images = [
            "https://c.tenor.com/F02Ep3b2jJgAAAAM/cute-kawai.gif",
            "https://c.tenor.com/V0nBQduEYb8AAAAM/anime-kiss-making-out.gif",
            "https://c.tenor.com/7T1cuiOtJvQAAAAM/anime-kiss.gif",
            "https://c.tenor.com/I8kWjuAtX-QAAAAM/anime-ano.gif",
            "https://c.tenor.com/JQ9jjb_JTqEAAAAM/anime-kiss.gif",
            "https://c.tenor.com/wDYWzpOTKgQAAAAM/anime-kiss.gif",
            "https://c.tenor.com/uZbyY_n5VZoAAAAM/kiss-anime.gif",
            "https://c.tenor.com/16MBIsjDDYcAAAAM/love-cheek.gif",
            "https://c.tenor.com/TWbZjCy8iN4AAAAM/girl-anime.gif",
            "https://c.tenor.com/G954PGQ7OX8AAAAM/cute-urara-shiraishi-anime.gif",
            "https://c.tenor.com/AtcFtesvEcEAAAAM/kissing-anime.gif",
            "https://c.tenor.com/etSTc3aWspcAAAAM/yuri-kiss.gif",
            "https://c.tenor.com/e6cYiAPPCq4AAAAM/anime-kissing.gif"
        ];

        const kissTarget = message.mentions.users.first();
        if (!kissTarget) {
            const embed = new MessageEmbed()
                .setTitle(`${message.author.username} kisses ${message.author.username} :heart:!`)
                .setImage(images[Math.floor(Math.random() * images.length)])
                .setFooter({text: "Powered by tenor."})
                .setColor(randomColor);
        
            message.channel.send({embeds: [embed]});
            return;
        } else if (kissTarget.id === message.client.user.id) {
            message.channel.send("You're making me blush! :heart:");
            return;
        } 

        const embed = new MessageEmbed()
            .setTitle(`${message.author.username} kisses ${kissTarget.username} :heart:!`)
            .setImage(images[Math.floor(Math.random() * images.length)])
            .setFooter({text: "Powered by tenor."})
            .setColor(randomColor);
    
        message.channel.send({embeds: [embed]});
        return;
        
    }
};
