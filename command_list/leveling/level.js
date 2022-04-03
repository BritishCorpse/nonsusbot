const { MessageAttachment } = require("discord.js");
const { Levels, Users } = require(`${__basedir}/db_objects`);
const Canvas = require("canvas");
const { translateForGuild } = require(`${__basedir}/functions`);

module.exports = {
    name: "level",
    usage: [],
    description: "See your or someone else's level.",
    async execute(message) {
        const user = message.mentions.users.first() || message.author;

        if(user.bot) {
            message.channel.send("Bots cannot be ranked!");
            return;
        }

        const userInDb = await Levels.findOne({
            where: {userId: user.id, guildId: message.guild.id}
        }) || {}; // this makes it an empty object if it is null

        //Creates an imaginary canvas with the size of 700x250
        const canvas = Canvas.createCanvas(700, 250);
        const context = canvas.getContext("2d");

        //Loads the background image.
        const background = await Canvas.loadImage("./images/levelbackground.png");        
        //Load another image, this time it's the avatar of the user.
        const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: "jpg" }));

        //This draws the background image. First 2 parameters are the starting point, and then the last 2 paramters stretch the image to match the entire canvas.
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        
        //Find the user in the db.
        const userInDbTwo = await Users.findOne({
            where: { user_id: user.id }
        }) || {};

        //Check if they have a badge.
        if (userInDbTwo.badge) {
            const myArray = userInDbTwo.badge.split(":");
            const word = myArray[1];
            console.log(word);

            const badge = await Canvas.loadImage(`./badges/${word}.png`);

            if (badge.height <= 50) {
                context.drawImage(badge, 25, 190, badge.width, badge.height);
            } else {
                context.drawImage(badge, 25, 190, badge.width / 1.5, badge.height / 1.5);
            }


        }

        //Write some text next to the badge
        context.font = "26px Arial";
        context.fillStyle = "white";
        context.fillText(user.tag, 90, 225);

        //Write some more text next to the pfp
        context.font = "40px Arial";
        context.fillText(translateForGuild(message.guild, "Level") + `: ${userInDb.level || "0"}  `, 25, 50);

        //write some subtext
        context.font = "26px Arial";
        context.fillText(translateForGuild(message.guild, "EXP") + `: ${userInDb.exp}/${userInDb.reqExp}`, 25, 100);

        //This draws a circle, the first 2 args are the xy coords, the third one is the radius.
        //To draw a circle the fourth and fifth arguments must be 0 and 2*pi.
        //This must be before you load the avatar image other wise it won't work.
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