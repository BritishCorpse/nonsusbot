const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");

module.exports = {
    name: ["imagetest"],
    usage: [],
    developer: true,
    async execute(message) {
        //Creates an imaginary canvas with the size of 700x250
        const canvas = Canvas.createCanvas(700, 250);
        const context = canvas.getContext("2d");

        //Loads the background image.
        const background = await Canvas.loadImage("./images/levelbackground.png");        
        //Load another image, this time it's the avatar of the user.
        const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: "jpg" }));

        //This draws the background image. First 2 parameters are the starting point, and then the last 2 paramters stretch the image to match the entire canvas.
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        
        //draw a fictional userbadge.
        const badge = await Canvas.loadImage("./images/whitecat.png");
        context.drawImage(badge, 25, 190, 60, 45);

        //Write some text next to the badge
        context.font = "26px Arial";
        context.fillStyle = "white";
        context.fillText("TALLOWEEEEEEEEEEEEEEEEEEEEEEEEEEN", 90, 225);

        //Write some more text next to the pfp
        context.font = "40px Arial";
        context.fillText("TEXTS: 9999/9999", 190, 50);

        //write some subtext
        context.font = "26px Arial";
        context.fillText("TXT: 999999/999999", 206, 100);

        //This draws a circle, the first 2 args are the xy coords, the third one is the radius.
        //To draw a circle the fourth and fifth arguments must be 0 and 2*pi.
        //This must be before you load the avatar image other wise it won't work.
        context.beginPath();
        context.arc(100, 90, 75, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        //This draws the avatar of the user.
        context.drawImage(avatar, 25, 15, 150, 150);

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
