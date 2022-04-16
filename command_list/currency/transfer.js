const { Users } = require(`${__basedir}/db_objects`);

const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");
const { formatRank } = require(`${__basedir}/functions`);

module.exports = {
    name: ["transfer"],
    description: "Transfer coins from your account to someone else's.",

    usage: [
        { tag: "user", checks: {isuseridinguild: null},
            next: [
                { tag: "amount", checks: {ispositiveinteger: null} }
            ]
        }
    ],

    async execute (message, args) {
        const user = message.mentions.users.first();
        const transferTarget = user; // args[0]

        //Find the target in the database.
        const userInDb = await Users.findOne({
            where: {user_id: user.id}
        }) || {}; // this makes it an empty object if it is null

        const authorInDb = await Users.findOne({
            where: {user_id: message.author.id}
        }) || {}; // this makes it an empty object if it is null

        //Crashes with bots so this is acheck to see if the user running is a bot.
        if(user.bot) {
            message.channel.send("Bots cannot be ranked!");
            return;
        }

        //Creates an imaginary canvas with the size of 700x250
        const canvas = Canvas.createCanvas(2480, 1748);
        const context = canvas.getContext("2d");

        //Loads the background image.
        const background = await Canvas.loadImage("./images/transfer.png");        

        const currentAmount = message.client.currency.getBalance(message.author.id);
        //const transferAmount = commandArgs.split(/ +/).find(arg => !/<@!?\d+>/.test(arg));
        const transferAmount = args[1];

        // Do checks to see if the money can actually be transferred
        if (transferTarget.bot) return message.channel.send(`Sorry ${message.author.username}, you cannot give money to bot accounts.`);
        if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
        if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author} you don't have that much.`);
        if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);

        message.client.currency.add(transferTarget.id, transferAmount);
        await message.client.currency.add(message.author.id, -transferAmount); // only need to await this one to show the correct number in the message

        //draws the background image
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        const fonts = {
            transferInfo: ["50px Roboto", "#000000"],
            recipientFont: ["50px Roboto", "#000000"],
            authorFont: ["50px Roboto", "#000000"],
            h1: ["34px Roboto Bold", "#000000"],
            signature: ["200px Signatura Monoline Script", "black"]
        };

        //declare the basic rank
        let newRecipientTag = user.tag;

        //Check if they have a rank.
        if (userInDb.rank) {
            const formattedRank = formatRank(userInDb.rank, user.tag);
            newRecipientTag = formattedRank[0];
            fonts.recipientFont[1] = formattedRank[1];
        }
        
        let newAuthorTag = message.author.tag;

        //check if the author has a rank.
        if (authorInDb.rank) {
            const formattedRank = formatRank(authorInDb.rank, message.author.tag);
            newAuthorTag = formattedRank[0];
            fonts.authorFont[1] = formattedRank[1];
        }

        const text = {

            amount: {
                text: `${transferAmount}GS`,
                font: fonts.transferInfo,
                x: canvas.width - 1000,
                y: canvas.height - 510,
                alignment: "left"
            },

            transactionId: {
                text: (Math.floor(Math.random() * 100000000)) + 999999999,
                font: fonts.transferInfo,
                x: 1050,
                y: 320,
                alignment: "left"
            },

            remunerator: {
                text: `${newAuthorTag}\n${message.guild.name}`,
                font: fonts.authorFont,
                x: 400,
                y: 697,
                alignment: "left"
            },

            remuneratorId: {
                text: message.author.id,
                font: fonts.transferInfo,
                x: 400,
                y: 1250,
                alignment: "left"
            },

            recipient: {
                text: `${newRecipientTag}\n${message.guild.name}`,
                font: fonts.recipientFont,
                x: 400,
                y: 290,
                alignment: "left"
            },

            recipientId: {
                text: user.id,
                font: fonts.transferInfo,
                x: 400,
                y: 110,
                alignment: "left"
            },

            remuneratorSignature: {
                text: message.author.username,
                font: fonts.signature,
                x: 400,
                y: 1050,
            }

        };

        //this checks for the size of the usernames given, to make sure that they dont go over the lines
        const authorLen = context.measureText(newAuthorTag).width;

        if (authorLen > 110) {
            text.remunerator.font = fonts.h1;
        }

        const recipientLen = context.measureText(newRecipientTag).width;

        if (recipientLen > 110) {
            text.recipient.font = fonts.h1;
        }


        //function to write text to the image
        function writeTxt(text, font, x, y, alignment) {
            context.font = font[0];
            context.fillStyle = font[1];
            context.textAlign = alignment;
            context.fillText(text, x, y);
        }

        //loops through all of the keys in the text object, read their properties, and write it to the image.
        for (const key in text) {
            const textToWrite = text[key];

            writeTxt(textToWrite.text, textToWrite.font, textToWrite.x, textToWrite.y, textToWrite.alignment);
        } 

        //Attach the image that we have drawn to the message.
        const attachment = new MessageAttachment(canvas.toBuffer(), "test.png");
        //Send the message
        message.channel.send({ files: [attachment] });
    }
};
