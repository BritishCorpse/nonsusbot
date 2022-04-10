const { Levels, Users } = require(`${__basedir}/db_objects`);

const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");
const { formatRank } = require(`${__basedir}/functions`);

module.exports = {
    name: ["leaderboard", "lb"],
    description: "Shows the users with the highest levels.",

    usage: [
    ],

    async execute(message) {
        function defineUser(userId) {
            return Levels.findOne({ where: {userId: userId, guildId: message.guild.id}  });
        }

        const canvas = Canvas.createCanvas(630, 1020);
        const context = canvas.getContext("2d");

        const background = await Canvas.loadImage("./images/background2.png");        
        
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        let levels = await Levels.findAll({ where: {guildId: message.guild.id} });
        levels = levels.filter(l => l.userId !== "1"); // filter out the casino user
        levels.sort((a, b) => a.level === b.level ? b.exp - a.exp : b.level - a.level);

        const topTen = levels.slice(0, 10);

        if (topTen.length === 0) {
            return message.channel.send("No user's were found in the database.");
        } else {

            let height = 50;

            // Sequential asynchronous loop from https://advancedweb.hu/how-to-use-async-functions-with-array-foreach-in-javascript/
            await topTen.reduce(async (memo, userLevel, position) => {
                await memo; // Waits for previous to end.
                const userInDb = await defineUser(userLevel.userId);
                const userInDiscord = await message.client.users.fetch(userLevel.userId);
                const userUser = await Users.findOne({ where: {user_id: userInDiscord.id} });
                const avatar = await Canvas.loadImage(userInDiscord.displayAvatarURL({ format: "jpg" }));

                //Check if they have a badge.
                if (userUser.badge) {
                    const myArray = userUser.badge.split(":");
                    const word = myArray[1];
                    const badge = await Canvas.loadImage(`./badges/${word}.png`);

                    if (badge.height <= 50) {
                        context.drawImage(badge, 25, height - 20, badge.width, badge.height);
                    } else {
                        context.drawImage(badge, 25, height - 20, badge.width / 1.5, badge.height / 1.5);
                    }
                }

                //Write the username
                context.font = "28px Roboto";
                context.fillStyle = "white";

                let rank = userInDiscord.tag;
                //Check if they have a rank.
                if (userUser.rank) {
                    const formattedRank = formatRank(userUser.rank, userInDiscord.tag);
                    rank = formattedRank[0];
                    const colour = formattedRank[1];  

                    //Set the colour of the brush
                    context.fillStyle = colour;
                }

                //Font size
                context.font = "38px Roboto Light";

                //Write the tag of the user.
                context.fillText(`${position + 1}. ${rank}`, 90, height);

                context.fillStyle = "#ffffff";

                //write the level of the user.
                context.fillText(`\nLevel: ${userInDb.level} EXP: ${userInDb.exp}/${userInDb.reqExp}`, 90, height);
                context.fillStyle = "white";

                //This draws the avatar of the user.
                context.drawImage(avatar, canvas.width - 90, height - 35, 75, 75);

                height += 100;
            }, undefined);

            //makes the image we've drawn into an attachment
            const attachment = new MessageAttachment(canvas.toBuffer(), "cprofile.png");
            //sends the attachment
            message.channel.send({ files: [attachment] });
        }


    }
};
