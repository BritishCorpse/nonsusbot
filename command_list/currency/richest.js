const { Users } = require(`${__basedir}/db_objects`);

const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");
const { formatRank, formatNumber } = require(`${__basedir}/functions`);

module.exports = {
    name: ["richest", "rich"],
    description: "Displays the richest users on the leaderboard.",

    usage: [
    ],

    async execute(message) {
        function defineUser(userId) {
            return Users.findOne({ where: {user_id: userId} });
        }

        const canvas = Canvas.createCanvas(630, 1020);
        const context = canvas.getContext("2d");

        const background = await Canvas.loadImage("./images/background2.png");        
        
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        const topTen = message.client.currency.sort((a, b) => b.balance - a.balance)
            //.filter(user => message.client.users.(user.user_id))
            .filter(user => user.user_id !== "1") // filter out the casino user
            .first(10);

        if (topTen.length === 0) {
            return message.channel.send("No user's were found in the database.");
        } else {

            let height = 50;

            // Sequential asynchronous loop from https://advancedweb.hu/how-to-use-async-functions-with-array-foreach-in-javascript/
            await topTen.reduce(async (memo, user, position) => {
                await memo; // Waits for previous to end.
                const userInDb = await defineUser(user.user_id);
                const userInDiscord = await message.client.users.fetch(user.user_id);
                const avatar = await Canvas.loadImage(userInDiscord.displayAvatarURL({ format: "jpg" }));

                //Check if they have a badge.
                if (userInDb.badge) {
                    const myArray = userInDb.badge.split(":");
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
                if (userInDb.rank) {
                    const formattedRank = formatRank(userInDb.rank, userInDiscord.tag);
                    rank = formattedRank[0];
                    const colour = formattedRank[1];  

                    //Set the colour of the brush
                    context.fillStyle = colour;
                }

                //Font size
                context.font = "38px Roboto Light";

                //Write the tag of the user.
                context.fillText(`${position + 1}. ${rank}`, 90, height);

                context.fillStyle = formatNumber(user.balance);

                //write the balance of the user.
                context.fillText(`\n${user.balance}`, 90, height);
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
