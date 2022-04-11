const { Users } = require(`${__basedir}/db_objects`);

const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");
const { formatRank, formatNumber } = require(`${__basedir}/functions`);

module.exports = {
    name: ["balance", "bal"],
    description: "Shows your balance, or someone else's balance.",

    usage: [
        { tag: "user", checks: {isuseridinguild: null} },
        { tag: "nothing", checks: {isempty: null} }
    ],

    async execute(message) {
        const user = message.mentions.users.first() || message.author;

        //Find the target in the database.
        const userInDb = await Users.findOne({
            where: {user_id: user.id}
        }) || {}; // this makes it an empty object if it is null

        //Crashes with bots so this is acheck to see if the user running is a bot.
        if(user.bot) {
            message.channel.send("Bots cannot be ranked!");
            return;
        }

        //Creates an imaginary canvas with the size of 700x250
        const canvas = Canvas.createCanvas(700, 250);
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
                context.drawImage(badge, 25, 190, badge.width, badge.height);
            } else {
                context.drawImage(badge, 25, 190, badge.width / 1.5, badge.height / 1.5);
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
        context.fillText(rank, 90, 225);

        //colour
        context.fillStyle = "white";

        if(message.client.currency.getBalance(user.id) < 1000000000000000000){
            //Write the balance
            context.font = "38px Roboto Light";
            context.fillText("Wallet in GS:", 25, 60);
            //does cool color thingy
            context.fillStyle = formatNumber(message.client.currency.getBalance(user.id) || 0);
            context.fillText(`\n${message.client.currency.getBalance(user.id) || "0"}`, 25, 60);
        } else {
            //Write the balance
            context.font = "38px Roboto Light";
            //does cool color thingy
            context.fillStyle = formatNumber(message.client.currency.getBalance(user.id) || 0);
            context.fillText("Wallet in GS:" + "> 1 quintillion.", 25, 60);
        }

        //change the color back to normal
        context.fillStyle = "white";

        //a quick infomratin thingy
        context.font = "20px Roboto Light";
        context.fillText("\nNote. This is only wallet worth, NOT net worth.", 25, 100); 


        //Make the pfp a circle
        context.beginPath();
        context.arc(600, 90, 75, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        //This draws the avatar of the user.
        context.drawImage(avatar, canvas.width - 175, 15, 150, 150);

        //Sets the colour of the brush.
        context.strokeStyle = "#ffffff";
        //Sets the size of the brush.
        context.lineWidth = 30;
    
        //Draws a rectangle around the entire screen. 
        //Change the first 2 parameters to determine the start point.
        //Change the last 2 paramateres to determine the bottom right corner of the rectangle.
        context.strokeRect(0, 0, canvas.width, canvas.height);

        //MAKE SURE THIS IS LAST.
        //Attach the image that we have drawn to the message.
        const attachment = new MessageAttachment(canvas.toBuffer(), "test.png");
        //Send the message
        message.channel.send({ files: [attachment] });

    }       

};
