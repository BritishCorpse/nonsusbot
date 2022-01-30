const { MessageEmbed } = require("discord.js");
const { Counting } = require(`${__basedir}/db_objects`);

module.exports = {
    name: ["countingleaderboard", "countinglb"],
    description: "Shows the top servers that have counted.",

    usage: [
    ],

    async execute(message) {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        const countings = await Counting.findAll({ where: {guildId: message.guild.id} });
        countings.sort((a, b) => b.guildCounted - a.guildCounted);

        const topTen = countings.slice(0, 10);

        const embed = new MessageEmbed()
            .setTitle("Top 10 Servers That Have Counted")
            .setColor(randomColor);

        if (topTen.length === 0) {
            embed.setDescription("According to my statisticas, there are no servers the leaderboard.");
        } else {
            // Sequential asynchronous loop from https://advancedweb.hu/how-to-use-async-functions-with-array-foreach-in-javascript/
            await topTen.reduce(async (memo, counting, position) => {
                await memo; // Waits for previous to end.
                const guild = await message.client.guilds.fetch(counting.guildId);
                embed.addField(`${position + 1}. ${guild.name}`, `Counted ${counting.guildCounted} time${counting.guildCounted > 1 ? "s" : ""}!`);
            }, undefined);
        }

        message.channel.send({ embeds: [embed] });
    }
};
