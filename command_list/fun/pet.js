const { MessageEmbed } = require('discord.js');


module.exports = {
    name: 'pet',
    description: "Pet whoever you'd like to.",
    execute(message, args){
        images = [
            "https://c.tenor.com/rZRQ6gSf128AAAAM/anime-good-girl.gif",
            "https://c.tenor.com/Wth7fEpgZ7EAAAAM/neko-anime-girl.gif",
            "https://c.tenor.com/hmzhWv3b9KsAAAAM/anime-head-pat-anime-head-rub.gif",
            "https://c.tenor.com/JWx5wmF6bqAAAAAM/charlotte-pat.gif",
            "https://c.tenor.com/N-d2Xso0k_cAAAAM/bakemonogatari-monogatari.gif",
            "https://c.tenor.com/afKzI9a28lIAAAAM/anime-girl.gif",
            "https://c.tenor.com/dmYhPDHbbI4AAAAM/misha-misha-necron-anos-voldigoad-the-misfit-of-demon-king-academy-headpat-pat.gif",
            "https://c.tenor.com/n6km1_0i97kAAAAM/anime-cat.gif",
            "https://c.tenor.com/tVwc20r-GwQAAAAM/rascal-does-not-dream-of-bunny-girl-senpai-seishun-buta-yar%C5%8D.gif",
            "https://c.tenor.com/bfpRP4Feg3oAAAAM/pet-anime.gif",
            "https://c.tenor.com/QAIyvivjoB4AAAAM/anime-anime-head-rub.gif",
            "https://c.tenor.com/frXOu8zwFOoAAAAM/tsukiuta-anime.gif",
            "https://c.tenor.com/8DaE6qzF0DwAAAAM/neet-anime.gif",
            "https://c.tenor.com/sjK6VdD1tC4AAAAM/anime-pet.gif",
            "https://c.tenor.com/o0re0DQzkd8AAAAM/anime-head-rub.gif"
        ];

        let petTarget = message.mentions.users.first();
        if (!petTarget) {
            const embed = new MessageEmbed()
            .setTitle(`${message.author.username} pets ${message.author.username}, how nice of them :heart:!`)
            .setImage(images[Math.floor(Math.random() * images.length)])
            .setColor("ORANGE")
        
            return message.channel.send( {embeds: [embed]} );
        }

        else if (petTarget.id === message.client.user.id) {
            return message.channel.send("Thanks! How did you know I was hungry? :heart:");
        }

        else if (petTarget.id === '484644637420552202') {
            if (message.author.id !== '834035562864050237') {
                return message.channel.send("Corpse blocks your.. petting?! HOW??!?!?");
            }

            else {
                const embed = new MessageEmbed()
                .setTitle(`${message.author.username} pets ${petTarget.username} :heart:!`)
                .setImage(images[Math.floor(Math.random() * images.length)])
                .setColor("ORANGE")
            
                return message.channel.send( {embeds: [embed]} );
            }
            
        }

        else {
            const embed = new MessageEmbed()
            .setTitle(`${message.author.username} pets ${petTarget.username}, how nice of them :heart:!`)
            .setImage(images[Math.floor(Math.random() * images.length)])
            .setColor("ORANGE")
        
            return message.channel.send( {embeds: [embed]} );
        };
    }
}
