const { Users } = require(`${__basedir}/db_objects`);

const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");
const { formatRank, formatNumber } = require(`${__basedir}/functions`);

module.exports = {
    name: ["countingprofile", "cprofile", "countinginfo", "cinfo"],
    description: "See the amount of numbers a user has counted, how many they've gotten wrong and how many right!",
    usage: [],
    async execute(message) {
        //Define the user to write information about.
        const user = message.mentions.users.first() || message.author;

        //Searches for the user in the database.
        const userInDb = await Users.findOne({
            where: {user_id: user.id}
        });

        if (!userInDb) {
            message.channel.send("User was not found in the database.");
        }

        //Crashes with bots so this is acheck to see if the user running is a bot.
        if(user.bot) {
            message.channel.send("Bots cannot be ranked!");
            return;
        }

        //Creates an imaginary canvas with the size of 700x250
        const canvas = Canvas.createCanvas(700, 350);
        const context = canvas.getContext("2d");

        //Loads the background image.
        const background = await Canvas.loadImage("./images/background2.png");        
        //Load another image, this time it's the avatar of the user.
        const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: "jpg" }));

        //This draws the background image. First 2 parameters are the starting point, and then the last 2 paramters stretch the image to match the entire canvas.
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        //Check if they have a badge.
        if (userInDb.badge) {
            const myArray = userInDb.badge.split(":");
            const word = myArray[1];

            const badge = await Canvas.loadImage(`./badges/${word}.png`);

            if (badge.height <= 50) {
                context.drawImage(badge, 25, 310, badge.width, badge.height);
            } else {
                context.drawImage(badge, 25, 310, badge.width / 1.5, badge.height / 1.5);
            }
        }

        //Write the username
        context.font = "28px Roboto";
        context.fillStyle = "white";

        let rank = user.tag;

        //Check if they have a rank.
        if (userInDb.rank) {
            const formattedRank = formatRank(userInDb.rank, user.tag);
            rank = formattedRank[0];
            const colour = formattedRank[1];  

            //Set the colour of the brush
            context.fillStyle = colour;
        }
        
        //Write the tag of the user.
        context.fillText(rank, 90, 325);

        //colour
        context.fillStyle = "white";

        //Font size
        context.font = "38px Roboto Light";

        if (userInDb.amountCounted < 1000000000000000000) {
            context.fillText("Counted: ", 25, 50);
            //epic colour of the number
            context.fillStyle = formatNumber(userInDb.amountCounted);
            context.fillText(`\n${userInDb.amountCounted || 0}`, 25, 50);

        } else {
            context.fillText("Counted: > 1 quintillion.", 25, 50);
        }

        context.fillStyle = "white";

        if (userInDb.countedCorrect < 1000000000000000000) {
            context.fillText("Correctly counted: ", 25, 150);
            //epic colour of the number
            context.fillStyle = formatNumber(userInDb.countedCorrect);
            context.fillText(`\n${userInDb.countedCorrect || 0}`, 25, 150);
        } else {
            context.fillText("Correctly counted: > 1 quintillion.", 25, 150);
        }

        context.fillStyle = "white";

        if (userInDb.amountCounted - userInDb.countedCorrect < 1000000000000000000) {
            context.fillText("Incorrectly counted: ", 25, 240);
            //epic colour of the number
            context.fillStyle = formatNumber(userInDb.amountCounted - userInDb.countedCorrect);
            context.fillText(`\n${userInDb.amountCounted - userInDb.countedCorrect || 0 - userInDb.countedCorrect || 0}`, 25, 240);
        } else {
            context.fillText("Incorrectly counted: > 1 quintillion", 25, 240);
        }

        //makes the pfp a circle
        context.beginPath();
        context.arc(600, 90, 75, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        //draws the actual avatar inside the confines of the new circle
        context.drawImage(avatar, canvas.width - 175, 15, 150, 150);

        //makes the image we've drawn into an attachment
        const attachment = new MessageAttachment(canvas.toBuffer(), "cprofile.png");
        //sends the attachment
        message.channel.send({ files: [attachment] });
    }
};
