const { MessageEmbed } = require("discord.js");

const { Levels } = require(`${__basedir}/db_objects`);
const developmentConfig = require(`${__basedir}/development_config.json`);

module.exports = {
    name: "addexp",
    execute(client) {
        client.on("messageCreate", async message => {
            const images = [
                "https://c.tenor.com/Gp2bwwvXtasAAAAd/among-us-meme.gif",
                "https://c.tenor.com/ZcjgRe9DltkAAAAM/rosu.gif",
                "https://c.tenor.com/mKTS5nbF1zcAAAAM/cute-anime-dancing.gif",
                "https://c.tenor.com/U8WV2zeMLBEAAAAM/anime-dancing.gif",
                "https://c.tenor.com/PXrldoXexykAAAAM/anime-dance.gif",
                "https://c.tenor.com/6YxzB6eZ8mAAAAAM/dance-anime-dance.gif",
                "https://c.tenor.com/Lkyf9b8203YAAAAM/dragon-maid-kanna-fite.gif",
                "https://c.tenor.com/1sxsYwSdCHUAAAAM/hiotibocchi-aru-aru.gif",
                "https://c.tenor.com/1GBajCU4TGUAAAAM/mugi-k-on.gif",
                "https://c.tenor.com/z31oZxFm2UIAAAAM/jin-mori-happy.gif",
                "https://c.tenor.com/d2NYSXokaK4AAAAM/pikachu-cheer-dance.gif",
                "https://c.tenor.com/mmw3gG69XGgAAAAM/rock-lee-cheering.gif",
                "https://c.tenor.com/tyb15RWixEYAAAAM/puck-anime.gif",
                "https://c.tenor.com/a7w4Tl3H1YkAAAAM/ilulu-dragon-maid.gif",
                "https://c.tenor.com/_9QBjj1MgLIAAAAM/yui-hirasawa-anime-cheering.gif"
            ];

            const randomColor = Math.floor(Math.random() * 16777215).toString(16);

            if (message.author.id === client.id) return;
            if (message.guild === null) return;
            if (message.author.bot && !testing) return;
            if (message.author.bot && testing && message.author.id !== developmentConfig.testing_bot_discord_user_id) return;

            let levelChannel;
            if (client.serverConfig.get(message.guild.id).levelup_channel_id) {
                levelChannel = await client.channels.fetch(client.serverConfig.get(message.guild.id).levelup_channel_id) || null;
            }
            
            if (levelChannel === null) return;

            // Disable it for bots, except for the testing bot


            // Check the word count and assign the variable expAmount to it.
            const expAmount = message.content.split(" ").length;

            //find user, give user 1 exp, check reqexp, if exp >= reqexp, level ++;
            const userInDb = await Levels.findOne({
                where: { userId: message.author.id, guildId: message.channel.guild.id }
            });
            if(userInDb === null) {
                return Levels.create({ userId: message.author.id, guildId: message.channel.guild.id, level: 1, exp: 1, reqExp: 200, lastMessage: Date.now() });
            }

            if (!userInDb.exp) {
                userInDb.exp = 0;
            }       

            if((Date.now() - 5000 ) > userInDb.lastMessage) {
                userInDb.exp += expAmount;
                userInDb.lastMessage = Date.now();
                userInDb.save();
    
    
                if (userInDb.exp >= userInDb.reqExp) {
                    await Levels.update({level: userInDb.level + 1}, {where: {userId: message.author.id, guildId: message.channel.guild.id}});
    
                    await Levels.update({reqExp: userInDb.level * 200}, {where: {userId: message.author.id, guildId: message.channel.guild.id}});
                    
                    await Levels.update({exp: 1}, {where: {userId: message.author.id, guildId: message.channel.guild.id}}).then(async () => {
    
                        if (!levelChannel) return;
    
                        const userInDbTwo = await Levels.findOne({
                            where: { userId: message.author.id, guildId: message.channel.guild.id }
                        });
    
                        const embed = new MessageEmbed()
                            .setTitle(`${message.author.username} has reached level ${userInDbTwo.level}!`)
                            .setDescription(`${userInDbTwo.reqExp} EXP until the next level.`)
                            .setFooter({text: `For leveling up you earned ${userInDb.level * 1000} RIP coin!`})
                            .setImage(images[Math.floor(Math.random() * images.length)])
                            .setColor(randomColor);
    
                        levelChannel.send({embeds: [embed]});
                        message.client.currency.add(message.author.id, userInDb.level * 1000);
                    });
                }


            }

            else {              
                userInDb.lastMessage = Date.now();
                userInDb.save();
                return;
            }


        });
    }
};
