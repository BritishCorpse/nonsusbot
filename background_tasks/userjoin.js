const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "userjoin",
    execute(client) {
        client.on("guildMemberAdd", (guildMember) => {
            const randomColor = Math.floor(Math.random()*16777215).toString(16);

            const funnyReplies = [
                "Hope you enjoy your stay!",
                "Have fun!",
                "HELLO FRIEND.",
                "Greetings stranger!",
                "I like the cut of your jib.",
                "You behave now!",
                "Better behave or you'll be punished."
            ];

            const welcomeImages = [
                "https://bestanimations.com/media/scary-halloween/938104650pixel-ghost-graveyard-cute-illustration-art-animated-gif.gif",
                "https://c4.wallpaperflare.com/wallpaper/972/447/646/digital-art-pixel-art-pixels-pixelated-grave-hd-wallpaper-preview.jpg",
                "https://i.redd.it/jcwrshs6u8361.png",
                "https://i.imgur.com/S6kUdAz.jpg",
                "https://64.media.tumblr.com/d98838acdf4cd21d5695b360492a5931/tumblr_pgtfv6Q8KO1xu7jxzo1_640.png",
                "https://i.pinimg.com/originals/70/42/93/7042937da7c929db4ff98aca29af3cd0.png",
                "https://i.redd.it/0yai71z6kse51.png",
                "https://cdna.artstation.com/p/assets/covers/images/020/206/362/large/kamile-al-pixel-graveyard.jpg?1566840400",
                "https://w.wallhaven.cc/full/rd/wallhaven-rdq5dq.png",
                "https://64.media.tumblr.com/9a863234a7a13d7732ff2fb73ea2cd32/aff16dea55830084-aa/s1280x1920/f72660bf3cd92ec70b290b1a34be1904d84be9f0.png",
                "https://art.ngfiles.com/images/1949000/1949143_aleha84_graveyard-night.gif?f1626184451",
            ];

            const channel = client.channels.cache.get(client.serverConfig.get(guildMember.guild.id).welcome_channel_id);

            if (channel === null) return;

            const embed = new MessageEmbed()
                .setDescription(`Welcome <@!${guildMember.id}> to ${guildMember.guild.name}. ${funnyReplies[Math.floor(Math.random() * funnyReplies.length)]}`)

                .setImage(welcomeImages[Math.floor(Math.random() * welcomeImages.length)])
                .setColor(randomColor);

            channel.send({embeds: [embed]});
        });
    }
};