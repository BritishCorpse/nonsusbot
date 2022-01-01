const { Message, MessageEmbed, Client, MessageActionRow } = require("discord.js");


module.exports = {
    name: 'kiss',
    description: "Kiss whoever you'd like to.",

    usage: [
        { tag: "user", checks: {isuseridinguild: null}, example: "786301097953591326" }
    ],

    async execute(message, args){
        var randomColor = Math.floor(Math.random()*16777215).toString(16);

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

        if (message.author.id === '786301097953591326') {
            return message.channel.send("No poki. Don't do this.");
        }
        let kissTarget = message.mentions.users.first();
        if (!kissTarget) {
            const embed = new MessageEmbed()
            .setTitle(`${message.author.username} kisses ${message.author.username} :heart:!`)
            .setImage(images[Math.floor(Math.random() * images.length)])
            .setColor(randomColor)
        
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
                .setColor(randomColor)
            
                return message.channel.send( {embeds: [embed]} );
            };
            ;
        }

        else if (kissTarget.id === '786301097953591326') {
            return message.channel.send("Sorry not happening.");
        }

        else {
            const embed = new MessageEmbed()
            .setTitle(`${message.author.username} kisses ${kissTarget.username} :heart:!`)
            .setImage(images[Math.floor(Math.random() * images.length)])
            .setColor(randomColor)
        
            return message.channel.send( {embeds: [embed]} );
        }



    }
}
