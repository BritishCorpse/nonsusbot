const { MessageEmbed, Message} = require('discord.js')
const { paginateEmbeds } = require(`${__basedir}/functions`);

module.exports = {
    name: 'changelog',
    description: "See what's new in the current version of Graveyard!",
    execute(message, args) {
        const prefix = message.client.serverConfig.get(message.guild.id).prefix;

        const embeds = [

            new MessageEmbed()
            .setTitle("Graveyard version 1.1.0 changelog!")
            .setDescription("Here's whats new!")
            .setFooter(`Do ${prefix}nerdstuff for the full changelog, including bugs, fixes, features, upcoming features and more.`),

            new MessageEmbed()
            .setTitle("Currency system!")
            .setDescription("For this version of graveyard we made an entire currency system, including ways to gain money, gamble it away, give it away to other players or even buy new things!\nHere's some cool commands to try out!")
            .addField(`See what you can buy at ${prefix}shop!`, `Usage: ${prefix}shop`)
            .addField(`Purchase an item from the shop with ${prefix}buy`, `Usage: ${prefix}buy {item name}`)
            .addField(`Join the VIP club on any server Graveyard is in with ${prefix}vip! Keep in mind, the server has to have the vip role set up in order for this to work! See _help configuration for more information!`, `Usage: ${prefix}vip`)
            .addField(`If a player is in need of some 💰's, check out ${prefix}transfer!`, `Usage: ${prefix}transfer {target} {amount}`)
            .addField(`Curious what you just bought? Try ${prefix}inventory! You can also see others inventory!`, `Usage: ${prefix}inventory {target(optional)}`)
            .addField(`Check out how many 💰's you have? Try ${prefix}balance! You can also spy on other people's balances!`, `Usage: ${prefix}bal || ${prefix}balance {target(optional)}`),

            new MessageEmbed()
            .setTitle("FUNFUNFUNFUNFUNFUN")
            .setDescription("Aside from having fun with money, you can also have fun with friends! That's why we made some fun commands for you and your friends to use on eachother!")
            .addField(`Someone being annoying? ${prefix}slap them!`, `Usage: ${prefix}slap {target}, you can even slap yourself if you're not behaving!`)
            .addField(`Sometimes we're all in need of a hug! So it's only natural we added ${prefix}hug!`, `Usage: ${prefix}hug {target}, show some self love!`)
            .addField(`Reserved for if you have that person you just really want to kiss. ${prefix}kiss`, `Usage: ${prefix}kiss {target}, ... I'd like a kiss?`)
            .addField(`Give someone a headpat? ${prefix}pet`, `Usage: ${prefix}pet {target}`)
        ]
        
        paginateEmbeds(message.channel, message.author, embeds);
    }
}