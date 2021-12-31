const { MessageEmbed } = require('discord.js');


module.exports = {
    name: 'slap',
    description: "Slap whoever you'd like to.",

    usage: [
        { tag: "user", checks: {isuseridinguild: null}, example: "786301097953591326" }
    ],

    execute(message, args){
        var randomColor = Math.floor(Math.random()*16777215).toString(16);

        images = [
            "https://c.tenor.com/Ws6Dm1ZW_vMAAAAM/girl-slap.gif",
            "https://c.tenor.com/iDdGxlZZfGoAAAAM/powerful-head-slap.gif",
            "https://c.tenor.com/wOCOTBGZJyEAAAAM/chikku-neesan-girl-hit-wall.gif",
            "https://c.tenor.com/EfhPfbG0hnMAAAAM/slap-handa-seishuu.gif",
            "https://c.tenor.com/FJsjk_9b_XgAAAAM/anime-hit.gif",
            "https://c.tenor.com/UDo0WPttiRsAAAAM/bunny-girl-slap.gif",
            "https://c.tenor.com/Sp7yE5UzqFMAAAAM/spank-slap.gif"
        ];

        funnyReplies = [
            "Ouch that hurt!",
            "Maybe dont annoy them next time?!",
            "That's going to leave a mark!",
            "That's going to hurt!",
            "OWIE!!!",
            "Cold..",
            "They deserved it!"
        ]

        let funnyReply = funnyReplies[Math.floor(Math.random() * funnyReplies.length)];

        let slapTarget = message.mentions.users.first();
        if (!slapTarget) {
            const embed = new MessageEmbed()
            .setTitle(`${message.author.username} slaps ${message.author.username}, ${funnyReply}`)
            .setImage(images[Math.floor(Math.random() * images.length)])
            .setColor(randomColor)
        
            return message.channel.send( {embeds: [embed]} );
        }

        else if (slapTarget.id === message.client.user.id) {
            return message.channel.send("Hey!! Don't slap me, what did I do?!");
        }

        else if (slapTarget.id === '484644637420552202') {
            if (message.author.id !== '834035562864050237') {
                return message.channel.send("Corpse blocked the slap!! Incredible!");
            }

            else {
                const embed = new MessageEmbed()
                .setTitle(`${message.author.username} slaps ${slapTarget.username}, ${funnyReply}`)
                .setImage(images[Math.floor(Math.random() * images.length)])
                .setColor(randomColor)
            
                return message.channel.send( {embeds: [embed]} );
            };

        }

        else {
            const embed = new MessageEmbed()
            .setTitle(`${message.author.username} slaps ${slapTarget.username}, ${funnyReply}`)
            .setImage(images[Math.floor(Math.random() * images.length)])
            .setColor(randomColor)
        
            return message.channel.send( {embeds: [embed]} );
        };
    }
}
