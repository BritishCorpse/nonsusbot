const { Message, MessageEmbed, Client } = require("discord.js");


module.exports = {
    name: 'kiss',
    description: "Kiss whoever you'd like to.",
    async execute(message, args){
        images = [
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

        let kissTarget = message.mentions.users.first();
        if (!kissTarget) {
            const embed = new MessageEmbed()
            .setTitle(`${message.author.username} kisses ${message.author.username} :heart:!`)
            .setImage(images[Math.floor(Math.random() * images.length)])
            .setColor("ORANGE")
        
            return message.channel.send( {embeds: [embed]} );
        }

        else if (kissTarget.id === message.client.user.id) {
            return message.channel.send("You're making me blush! :heart:");
        }
        // Disable below lines if you want people to be able to do actions to me.
        else if (kissTarget.id === '484644637420552202') {
            if (message.author.id !== '834035562864050237') {
                return message.channel.send("Sorry, corpse is not accepting kisses currently.")
            }

            else {
                const embed = new MessageEmbed()
                .setTitle(`${message.author.username} kisses ${kissTarget.username} :heart:!`)
                .setImage(images[Math.floor(Math.random() * images.length)])
                .setColor("ORANGE")
            
                return message.channel.send( {embeds: [embed]} );
            };
            ;
        }

        else {
            const embed = new MessageEmbed()
            .setTitle(`${message.author.username} kisses ${kissTarget.username} :heart:!`)
            .setImage(images[Math.floor(Math.random() * images.length)])
            .setColor("ORANGE")
        
            return message.channel.send( {embeds: [embed]} );
        }



    }
}
