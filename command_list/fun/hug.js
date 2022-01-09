const { MessageEmbed } = require("discord.js");


module.exports = {
    name: "hug",
    description: "Hug whoever you'd want to.",

    usage: [
        { tag: "user", checks: {isuseridinguild: null}, example: "786301097953591326" }
    ],

    async execute(message){
        const randomColor = Math.floor(Math.random()*16777215).toString(16);

        // Maybe make a library accessible always out of this???
        const images = [
            "https://c.tenor.com/rQ2QQQ9Wu_MAAAAM/anime-cute.gif",
            "https://c.tenor.com/Ct4bdr2ZGeAAAAAM/teria-wang-kishuku-gakkou-no-juliet.gif",
            "https://c.tenor.com/Ct4bdr2ZGeAAAAAM/teria-wang-kishuku-gakkou-no-juliet.gif",
            "https://c.tenor.com/9e1aE_xBLCsAAAAM/anime-hug.gif",
            "https://c.tenor.com/0vl21YIsGvgAAAAM/hug-anime.gif",
            "https://c.tenor.com/xIuXbMtA38sAAAAM/toilet-bound-hanakokun.gif",
            "https://c.tenor.com/ItpTQW2UKPYAAAAM/cuddle-hug.gif",
            "https://c.tenor.com/2bWwi8DhDsAAAAAM/hugs-and-love.gif",
            "https://c.tenor.com/0PIj7XctFr4AAAAM/a-whisker-away-hug.gif",
            "https://c.tenor.com/SPs0Rpt7HAcAAAAM/chiya-urara.gif",
            "https://c.tenor.com/mmQyXP3JvKwAAAAM/anime-cute.gif",
            "https://c.tenor.com/G9yuomdknAsAAAAM/anime-couple.gif",
            "https://c.tenor.com/JTqXUbfSSkYAAAAM/anime-bed.gif",
            "https://c.tenor.com/5UwhB5xQSTEAAAAM/anime-hug.gif",
            "https://c.tenor.com/SDQNVUH6sCMAAAAM/blushing-anime.gif",
            "https://c.tenor.com/qF7mO4nnL0sAAAAM/abra%C3%A7o-hug.gif"
        ];
        
        const hugTarget = message.mentions.users.first();

        if (!hugTarget) {
            const embed = new MessageEmbed()
                .setTitle(`${message.author.username} hugs ${message.author.username} :heart:!`)
                .setImage(images[Math.floor(Math.random() * images.length)])
                .setColor(randomColor);
        
            message.channel.send({embeds: [embed]});
            return;
        } else if (hugTarget.id === message.client.user.id) {
            message.channel.send("You're making me blush! :heart:");
            return;
        } else if (hugTarget.id === "484644637420552202") {
            // Disable below lines if you want people to be able to do actions to me.
            if (message.author.id !== "834035562864050237") {
                message.channel.send("Sorry, corpse is not accepting hugs currently.");
                return;
            } else {
                const embed = new MessageEmbed()
                    .setTitle(`${message.author.username} hugs ${hugTarget.username} :heart:!`)
                    .setImage(images[Math.floor(Math.random() * images.length)])
                    .setColor(randomColor);
            
                message.channel.send({embeds: [embed]});
                return;
            }        
        }

        const embed = new MessageEmbed()
            .setTitle(`${message.author.username} hugs ${hugTarget.username} :heart:!`)
            .setImage(images[Math.floor(Math.random() * images.length)])
            .setColor(randomColor);

        message.channel.send({embeds: [embed]});
    }   
};
