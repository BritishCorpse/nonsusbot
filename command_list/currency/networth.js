const { MessageEmbed } = require("discord.js");
const { Users } = require(`${__basedir}/db_objects`);
const { UserPortfolio } = require(`${__basedir}/db_objects`);
const { getUserItems } = require(`${__basedir}/functions`);

const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");
const { formatRank } = require(`${__basedir}/functions`);

module.exports = {
    name: "networth",
    description: "See your, or someone else's net worth!",
    
    usage: [
        { tag: "user", checks: {isuseridinguild: null} },
        { tag: "nothing", checks: {isempty: null} }
    ],
    async execute(message) {

        //Define some basic stuff like the target, and find the user in the database.
        const user = message.mentions.users.first() || message.author;

        const userInDb = await Users.findOne({ where: {user_id: user.id }});

        if(!userInDb) {
            message.channel.send("User was not found!");
            return;
        }   

        //Check the users balance.
        const userBalance = message.client.currency.getBalance(user.id);
        
        //Find all the shares of the user, then calculate the worth of the shares.
        async function getUserShares(userId) {

            // Gets the porfolio of the user
            const portfolio = await UserPortfolio.findAll({
                where: {
                    user_id: userId
                },
                include: ["shares"]
            });

            if (portfolio === null)
                return [];

            return portfolio;
        }
        
        const shares = await getUserShares(user.id);

        let portfolioWorth = 0;

        if (shares.length === 0) {
            portfolioWorth = 0;
        }

        for (let i = 0; i < shares.length; ++i) {
            if (shares.amount <= 0) {continue;}

            portfolioWorth += parseInt(shares[i].shares.currentPrice * shares[i].amount);
        }
        
        //Calculate items worth.
        let itemsWorth = 0;

        const items = await getUserItems(user.id);

        if (items.length === 0) {
            itemsWorth = 0;
        }

        for (let i = 0; i < items.length; ++i) {
            const item = items[i];

            if (item.amount === 0) {continue;}
            
            itemsWorth += parseInt(items[i].item.cost * items[i].amount);
            console.log(itemsWorth);
        }

        //Total calculated networth.
        const calculatedNetworth = portfolioWorth + parseInt(userBalance) + parseInt(itemsWorth);

        //Creates an imaginary canvas with the size of 700x250
        const canvas = Canvas.createCanvas(700, 400);
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
                context.drawImage(badge, 25, 345, badge.width, badge.height);
            } else {
                context.drawImage(badge, 25, 345, badge.width / 1.5, badge.height / 1.5);
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
        context.fillText(rank, 90, 380);

        //colour
        context.fillStyle = "white";

        //Networth
        if(calculatedNetworth < 1000000000000000000) {
            //Write the total networth.
            context.font = "25px Roboto Light";
            context.fillText("Net worth: ", 25, 60);
            context.fillText(calculatedNetworth, 25, 90);
        } else {
            //Write the total networth.
            context.font = "25px Roboto Light";
            context.fillText("Net worth: ", 25, 60);
            context.fillText("> 1 quintillion.", 25, 90);
        }

        if(userBalance < 1000000000000000000){
            //Write the balance
            context.font = "25px Roboto Light";
            context.fillText("Wallet:", 25, 120);
            context.fillText(`${message.client.currency.getBalance(user.id) || "0"}`, 25, 150);
            
        } else {
            //Write the balance
            context.font = "25px Roboto Light";
            context.fillText("Wallet:" + "> 1 quintillion.", 25, 150);
        }

        if(portfolioWorth < 1000000000000000000) {
            //Write the worth of the portfolio.
            context.font = "25px Roboto Light";
            context.fillText("Portfolio worth:", 25, 180);
            context.fillText(portfolioWorth, 25, 210);

        } else {
            //Write the balance
            context.font = "25px Roboto Light";
            context.fillText("Portfolio worth:" + "> 1 quintillion.", 25, 210);
        }

        if (itemsWorth < 1000000000000000000) {
            //Write the forth of the inventory.
            context.font = "25px Roboto Light";
            context.fillText("Inventory worth:", 25, 240);
            context.fillText(itemsWorth, 25, 270);
        } else {
            context.fillText("Inventory worth: > 1 quintillion", 25, 270);
        }


        //Write some stuff explaining currency stuff.
        context.font = "20px Roboto Light";
        context.fillText("Note: these values are all measured in Gravestones.", 25, 320);

        
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

