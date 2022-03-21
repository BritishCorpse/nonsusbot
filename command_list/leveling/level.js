const { MessageAttachment } = require("discord.js");
const { Levels } = require(`${__basedir}/db_objects`);
const Canvas = require("canvas");

const { translateForGuild } = require(`${__basedir}/functions`);

const applyText = (canvas, text, size) => {
    const context = canvas.getContext("2d");
    let fontSize = size;

    do {
        context.font = `${fontSize -= 10}px sans-serif`;
    } while (context.measureText(text).width > canvas.width - 300);

    return context.font;
};

module.exports = {
    name: "level",
    description: "See your, or someone else's level!",
    usage: [],

    async execute(message) {
        const user = message.mentions.users.first() || message.author;

        if(user.bot) {
            message.channel.send("Bots cannot be ranked!");
            return;
        }

        const userInDb = await Levels.findOne({
            where: {userId: user.id, guildId: message.guild.id}
        }) || {}; // this makes it an empty object if it is null

        const canvas = Canvas.createCanvas(700, 200);
        const context = canvas.getContext("2d");

        const background = await Canvas.loadImage("./images/levelbackground.png");
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        context.strokeStyle = "#000000";
        context.strokeRect(0, 0, canvas.width, canvas.height);

        //This is your level and required EXP
        context.font = applyText(canvas, translateForGuild(message.guild, "Level") + `: ${userInDb.level || "0"}  ` + translateForGuild(message.guild, "EXP") + `: ${userInDb.exp}/${userInDb.reqExp}`, canvas.width / 4, canvas.height / 1.4, 50);
        context.fillStyle = "#ffffff";
        context.fillText(translateForGuild(message.guild, "Level") + `: ${userInDb.level || "0"}  ` + translateForGuild(message.guild, "EXP") + `: ${userInDb.exp}/${userInDb.reqExp}`, canvas.width / 4, canvas.height / 1.4);

        //This is the tag of the user.
        context.font = applyText(canvas, `${user.tag}!`, 70);
        context.fillStyle = "#ffffff";
        context.fillText(`${user.tag}`, canvas.width / 4, canvas.height / 2.2);
        
        const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: "jpg" }));
        context.drawImage(avatar, 50, canvas.height / 4, 100, 100);

        const attachment = new MessageAttachment(canvas.toBuffer(), "image.png");

        message.reply({ files: [attachment] });
    }
};
