const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");

const applyText = (canvas, text, size) => {
    const context = canvas.getContext("2d");
    let fontSize = size;

    do {
        context.font = `${fontSize -= 10}px sans-serif`;
    } while (context.measureText(text).width > canvas.width - 300);

    return context.font;
};

module.exports = {
    developer: true,
    name: "imagetest",
    description: "test the canvas package",
    usage: [],
    async execute(message) {
        const canvas = Canvas.createCanvas(700, 200);
        const context = canvas.getContext("2d");

        const background = await Canvas.loadImage("https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg");
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        context.strokeStyle = "#000000";
        context.strokeRect(0, 0, canvas.width, canvas.height);

        context.font = applyText(canvas, "level: 30000, EXP: 99999/999999", 50);
        context.fillStyle = "#ffffff";
        context.fillText("level: 30000, EXP: 99999/999999", canvas.width / 4, canvas.height / 1.4);

        context.font = applyText(canvas, `${message.author.tag}!`, 70);
        context.fillStyle = "#ffffff";
        context.fillText(`${message.author.tag}`, canvas.width / 4, canvas.height / 2.2);
        
        const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: "jpg" }));
        context.drawImage(avatar, 50, canvas.height / 4, 100, 100);

        const attachment = new MessageAttachment(canvas.toBuffer(), "profile-image.png");

        message.reply({ files: [attachment] });
    }
};