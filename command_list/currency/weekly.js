const { Users } = require(`${__basedir}/db_objects`);
const Canvas = require("canvas");
const { formatRank } = require(`${__basedir}/functions`);
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: "weekly",
    description: "Claim your weekly coins!",
    usage: [],
    
    async execute(message){
        const user = message.author;

        const d = new Date();
        const time = d.getTime();

        const weeklyMoney = 10000;

        //Find the target in the database.
        const userInDb = await Users.findOne({
            where: {user_id: user.id}
        }) || {}; // this makes it an empty object if it is null


        //If they've never claimed daily, make it possible to claim daily, and update the database.
        if (userInDb.lastWeekly === null) {
            await Users.update({ lastWeekly: time - 86400000 * 7 }, { where: { user_id: message.author.id } });
        }   

        //If theyre too early to claim daily.
        if (time - 86400000 * 7 < userInDb.lastWeekly) {
            message.channel.send(`You can't claim your weekly reward yet! You can claim your next daily reward at: ${new Date(userInDb.lastWeekly + 86400000 * 7).toGMTString()}`);
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

        let rank = message.author.tag;

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

        //colour for the level and things
        context.fillStyle = "white";

        //Write the things
        context.font = "44px Roboto Light";
        context.fillText("+10000 Gravestones!", 25, 60);

        //Inform the amount
        context.font = "20px Roboto Light";
        context.fillText("You claimed your weekly reward!", 25, 100); 
        context.fillText("You can claim your next weekly reward in 7 days!", 25, 125);
        

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

        message.client.currency.add(message.author.id, weeklyMoney);
        await Users.update({ lastWeekly: time }, { where: { user_id: message.author.id } });

    }
};