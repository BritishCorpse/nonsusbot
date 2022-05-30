/* Require all necessary functions from the utilities folder. 
   In this instance its the menu.js file we'll be mostly using.
*/
const { 
    shopOptions,
    asleepWarning,
    fellAsleep,
    promptBuy,
    areYouSure,
    inputText,
    promptStock,
    promptItem,
    
} = require(`${__basedir}/utilities`);

const { MessageEmbed } = require("discord.js");

const { CurrencyShop, Users, Stocks, UserPortfolio, UserItems } = require(`${__basedir}/db_objects`);
const { paginateEmbeds } = require(`${__basedir}/utilities`);
const { gravestone } = require(`${__basedir}/emojis.json`);

async function createEmbed(title, shopkeeper, client) {
    return new MessageEmbed({
        title: title,

        url: "https://talloween.github.io/graveyardbot/",

        author: {
            name: shopkeeper,
            icon_url: client.user.avatarURL(),
            url: "https://talloween.github.io/graveyardbot/",
        },

        color: "33a5ff",
    });
}

async function buyItem(channel, user, item, client) {
    /* It's creating a prompt for the user to choose from. */
    channel.send(`${item.itemEmoji}${item.name} is currently for ${item.cost}${gravestone}'s each.`);
    const yesNo = await areYouSure(channel, user).catch(async () => {
        await asleepWarning(channel, user);
    });
    
    // if they chose yes on the yes/no prompt, 
    // adds the badge to the user and removes the corresponding amount of money.
    if (yesNo === true) {
        let yesLoop = true;
        while (yesLoop === true) {
            const amount = await inputText(channel, user, "How many would you like to buy?", 100).catch(async () => {
                await asleepWarning(channel, user);
            });
            
            if (isNaN(amount)) {
                channel.send("Please enter a number!");
                continue;
            }


            //if too expensiv
            if (item.cost * amount > await client.currency.getBalance(user.id)) {
                channel.send(`You don't have enough ${gravestone}'s, ${user.username}`);
                continue;   
            }
            
            /*It's sending a message to the user saying that they bought the
            rank. */
            channel.send(`You bought ${amount} of the item ${item.itemEmoji}**${item.name}** for ${item.cost * amount}${gravestone}'s`);

            /* It's getting the user from the database. */
            const userInDb = await Users.findOne({
                where: {
                    user_id: user.id
                }
            });
    
            /* It's removing the cost of the item from the user's balance. */
            client.currency.add(user.id, -item.cost * amount);

            /* It's saving the user to the database. */
            await userInDb.save();

            /* Adding the item to the user's inventory. */
            const itemInInv = await UserItems.findOne({
                where: {
                    user_id: user.id,
                    item_id: item.id,
                }
            }) || null;

            //if it doesnt exist in the users inv already, create it.
            if (itemInInv === null) {
                await UserItems.create({
                    user_id: user.id,
                    item_id: item.id,
                    amount: amount
                });
            } else {
                itemInInv.amount += parseInt(amount);
                await itemInInv.save();
            }

            /* It's setting the loop to false so it can exit the loop. */
            yesLoop = false;
            continue;
        }
    }
    /* It's checking if the user chose the "No" option. If they did, it'll
    set rankLoop to false and continue the loop. */
    else if (yesNo === false) {
        return false;
    }
}

async function showItemInfo(channel, user, item, client) {
    const embed = await createEmbed(`Information about ${item.name}`, "Shop assistant", client);
                
    embed.addField("Cost", `${item.cost}${gravestone}`);
    embed.addField("Emoji", `${item.itemEmoji}`);
    channel.send({ embeds: [embed] });
    return;
}

async function chooseItem(channel, user, category, client, buyUser) {
    /* It's creating an empty array where we'll store our embeds. */
    const embeds = [];

    /* It's getting all the items from the database that have the category of "Badges". */
    const items = await CurrencyShop.findAll({
        where: {
            category: category
        }
    }) || null;

    /* It's checking if the items are null. If they are, it'll send a message saying
    that no badges were found. It'll then set looping to false and return. */
    if (items === null) {
        channel.send("No items were found. (This shouldn't be happening.)");
        return;
    }

    /* It's creating a variable called embed. It's then looping through all the items
    in the database. If the item is divisible by 10, it'll create a new embed and
    push it to the embeds array. It'll then add a field to the embed. */
    let embed;

    for (const i in items) {
        const item = items[i];

        if (i % 10 === 0) {
            embed = await createEmbed("Shop!", "Graveyard", client);
            embeds.push(embed);  
        }

        embed.addField(`${item.itemEmoji}${item.name}, ${item.itemDescription}`, `${item.cost}${gravestone}`);
    }

    /* It's paginating the embeds. */
    await paginateEmbeds(channel, user, embeds, {useDropdown: true});

    /* It's creating a prompt for the user to choose from. */
    const buyOption = await promptBuy(channel, user, category, "Which item would you like to view?").catch(async () => {
        await asleepWarning(channel, user);
    });
    
    /* It's checking if the buyOption is null. If it is, it'll send a message
    saying that the item doesn't exist. It'll then return. */
    if (!buyOption) {
        channel.send("That item doesn't exist.");
        return;
    }

    let buyLoop = true;
    while (buyLoop === true) {
        const stockBuyOption = await shopOptions(channel, user, `You are viewing ${buyOption.name}`, [
            "Buy",
            "More info",
            "Back to menu",
        ]).catch(async () => {
            await asleepWarning(channel, user);
        });

        if (stockBuyOption === 0) {
            await buyItem(channel, buyUser, buyOption, client);
        }   

        if (stockBuyOption === 1) {
            await showItemInfo(channel, user, buyOption, client);
        }

        if (stockBuyOption === 2) {
            buyLoop = false;
            continue;
        }
    }
}

module.exports = {
    name: ["shop"],
    description: "Go for a shopping spree!",
    usage: [],
    async execute(message) {
        // funcitons and stuff
        function makeEmbed(title, shopkeeper) {
            return new MessageEmbed({
                title: title,

                url: "https://talloween.github.io/graveyardbot/",

                author: {
                    name: shopkeeper,
                    icon_url: message.client.user.avatarURL(),
                    url: "https://talloween.github.io/graveyardbot/",
                },

                color: "33a5ff",
            });
        }

        let looping = true;
        while (looping === true) {
            message.channel.sendTyping();
            /* It's creating a prompt for the user to choose from. */
            const startChoice = await shopOptions(message.channel, message.author, "What would you like to do?", [
                "Buy",
                "Sell",
                "Finish"
            ]).catch(async () => {
                await fellAsleep(message.channel, message.author);
            });

            if (startChoice === 0) {       
                let buyLoop = true;
                while (buyLoop === true) {
                    const buyChoice = await shopOptions(message.channel, message.author, "What would you like to buy?", [
                        "Ranks",
                        "Badges",
                        "Stocks",
                        "Food",
                        "Cats",
                        "Dogs",
                        "Special",
                        "Back to menu"
                    ]).catch(async () => {
                        await asleepWarning(message.channel, message.author);
                    });
    
                    //up until line 206 its just about ranks.
                    if (buyChoice === 0) {
                        /* It's creating an empty array where we'll store our embeds. */
                        const embeds = [];
    
                        /* It's getting all the items from the database that have the category of "Rank". */
                        const items = await CurrencyShop.findAll({
                            where: {
                                category: "Rank"
                            }
                        }) || null;
    
                        /* It's checking if the items are null. If they are, it'll send a message saying
                        that no badges were found. It'll then set looping to false and return. */
                        if (items === null) {
                            message.channel.send("No ranks were found. (This shouldn't be happening.)");
                            looping = false;
                            return;
                        }
    
                        /* It's creating a variable called embed. It's then looping through all the items
                        in the database. If the item is divisible by 10, it'll create a new embed and
                        push it to the embeds array. It'll then add a field to the embed. */
                        let embed;

                        for (const i in items) {
                            const item = items[i];
                
                            if (i % 10 === 0) {
                                embed = makeEmbed("Ranks", "Graveyard Ranks");
                                embeds.push(embed);  
                            }
                                        
                            embed.addField(`${item.itemEmoji}${item.name}, ${item.itemDescription}`, `${item.cost}${gravestone}`);
                        }
                
                        /* It's paginating the embeds. */
                        paginateEmbeds(message.channel, message.author, embeds, {useDropdown: true});
                        

                        // ask the user which rank they want to view
                        let rankLoop = true;
                        while (rankLoop === true) {
                            /* It's creating a prompt for the user to choose from. */
                            const buyOption = await promptBuy(message.channel, message.author, "Rank", "Which rank would you like to view?").catch(async () => {
                                await asleepWarning(message.channel, message.author);
                            });
                            
                            /* It's checking if the buyOption is null. If it is, it'll send a message
                            saying that the item doesn't exist. It'll then return. */
                            if (!buyOption) {
                                message.channel.send("That item doesn't exist.");
                                return;
                            }
                           
                            /* Show's the user which action they want to take on the rank, theres buy, more info and back to menu */
                            let chooseActionLoop = true;
                            while (chooseActionLoop == true) {
                                const rankBuyOption = await shopOptions(message.channel, message.author, `You are viewing the rank ${buyOption.itemEmoji}${buyOption.name}`, [
                                    "Buy",
                                    "More info",
                                    "Back to menu",
                                ]).catch(async () => {
                                    await asleepWarning(message.channel, message.author);
                                });
    
                                // if they chose buy
                                if (rankBuyOption === 0) {
                                    /* It's checking if the user has enough money to buy the item. If they
                                    don't, it'll send a message saying that they don't have enough money.
                                    It'll then return. */
                                    if (buyOption.cost > message.client.currency.getBalance(message.author.id)) {
                                        message.channel.send(`You don't have enough ${gravestone}'s, ${message.author.username}`);
                                        continue;   
                                    }

                                    /* It's creating a prompt for the user to choose from. */
                                    message.channel.send(`${buyOption.itemEmoji}${buyOption.name} is currently selling for ${buyOption.cost}${gravestone}'s each.`);
                                    const yesNo = await areYouSure(message.channel, message.author).catch(async () => {
                                        await asleepWarning(message.channel, message.author);
                                    });
                                    
                                    // if they chose yes on the yes/no prompt, 
                                    // adds the rank to the user and removes the corresponding amount of money.
                                    if (yesNo === true) {
                                        /* It's sending a message to the user saying that they bought the
                                        rank. */
                                        message.reply(`You bought the rank ${buyOption.itemEmoji}**${buyOption.name}**.`);
    
                                        /* It's getting the user from the database. */
                                        const user = await Users.findOne({
                                            where: {
                                                user_id: message.author.id
                                            }
                                        });
                                
                                        /* It's removing the cost of the item from the user's balance. */
                                        message.client.currency.add(message.author.id, -buyOption.cost);
    
                                        /* It's setting the user's rank and badge to the rank they bought. */
                                        user.rank = buyOption.name;
    
                                        /* It's saving the user to the database. */
                                        await user.save();

                                        /* It's setting the loop to false so it can exit the loop. */
                                        rankLoop = false;
                                        continue;
                                    }
                                    /* It's checking if the user chose the "No" option. If they did, it'll
                                    set rankLoop to false and continue the loop. */
                                    else if (yesNo === false) {
                                        rankLoop = false;
                                        continue;
                                    } else {
                                        /* It's just a failsafe. If the user somehow gets to this point,
                                        it'll send a message saying that it isn't supposed to happen.
                                        It'll then set all the loops to false and return. */
                                        message.channel.send("This isn't supposed to happen.");
                                        rankLoop = false;
                                        buyLoop = false;
                                        looping = false;
                                        chooseActionLoop = false;
                                        return;
                                    }
                                }
                                
                                // if they chose more info.
                                if (rankBuyOption === 1) {
                                    const embed = makeEmbed(`Information about ${buyOption.itemEmoji}${buyOption.name}`, "Shop assistant");
                                    
                                    embed.addField("Cost", `${buyOption.cost}${gravestone}`);
                                    embed.addField("Emoji", `${buyOption.itemEmoji}`);
                                    message.channel.send({ embeds: [embed] });
                                    continue;
                                }

                                /* It's checking if the user chose the "Back to rank list" option. If
                                they did, it'll set chooseActionLoop to false and continue the loop. */
                                if (rankBuyOption === 2) {
                                    chooseActionLoop = false;
                                    rankLoop = false;
                                    continue;
                                }
                            }
                        }
                    }

                    // this is for badges
                    if (buyChoice === 1) {
                        /* It's creating an empty array where we'll store our embeds. */
                        const embeds = [];

                        /* It's getting all the items from the database that have the category of "Badges". */
                        const items = await CurrencyShop.findAll({
                            where: {
                                category: "Badges"
                            }
                        }) || null;
    
                        /* It's checking if the items are null. If they are, it'll send a message saying
                        that no badges were found. It'll then set looping to false and return. */
                        if (items === null) {
                            message.channel.send("No ranks were found. (This shouldn't be happening.)");
                            looping = false;
                            return;
                        }
    
                        /* It's creating a variable called embed. It's then looping through all the items
                        in the database. If the item is divisible by 10, it'll create a new embed and
                        push it to the embeds array. It'll then add a field to the embed. */
                        let embed;

                        for (const i in items) {
                            const item = items[i];
                
                            if (i % 10 === 0) {
                                embed = makeEmbed("Badges", "Graveyard Badges");
                                embeds.push(embed);  
                            }
                                        
                            embed.addField(`${item.itemEmoji}${item.name}, ${item.itemDescription}`, `${item.cost}${gravestone}`);
                        }
                
                        /* It's paginating the embeds. */
                        paginateEmbeds(message.channel, message.author, embeds, {useDropdown: true});

                        let badgeLoop = true;
                        while (badgeLoop === true) {
                            /* It's creating a prompt for the user to choose from. */
                            const buyOption = await promptBuy(message.channel, message.author, "Badges", "Which badge would you like to view?").catch(async () => {
                                await asleepWarning(message.channel, message.author);
                            });

                            /* It's checking if the buyOption is null. If it is, it'll send a message
                            saying that the item doesn't exist. It'll then return. */
                            if (!buyOption) {
                                message.channel.send("That item doesn't exist.");
                                return;
                            }
                            
                            /* Show's the user which action they want to take on the rank, theres buy, more info and back to menu */
                            let chooseActionLoop = true;
                            while (chooseActionLoop == true) {
                                const rankBuyOption = await shopOptions(message.channel, message.author, `You are viewing the badge ${buyOption.itemEmoji}${buyOption.name}`, [
                                    "Buy",
                                    "More info",
                                    "Back to menu",
                                ]).catch(async () => {
                                    await asleepWarning(message.channel, message.author);
                                });
    
                                // if they chose buy
                                if (rankBuyOption === 0) {
                                    /* It's checking if the user has enough money to buy the item. If they
                                    don't, it'll send a message saying that they don't have enough money.
                                    It'll then return. */
                                    if (buyOption.cost > message.client.currency.getBalance(message.author.id)) {
                                        message.channel.send(`You don't have enough ${gravestone}'s, ${message.author.username}`);
                                        continue;   
                                    }
                                    
                                    /* It's creating a prompt for the user to choose from. */
                                    message.channel.send(`${buyOption.itemEmoji}${buyOption.name} is currently selling for ${buyOption.cost}${gravestone}'s each.`);
                                    const yesNo = await areYouSure(message.channel, message.author).catch(async () => {
                                        await asleepWarning(message.channel, message.author);
                                    });
                                    
                                    // if they chose yes on the yes/no prompt, 
                                    // adds the badge to the user and removes the corresponding amount of money.
                                    if (yesNo === true) {
                                        let yesLoop = true;
                                        while (yesLoop === true) {
                                            const amount = await inputText(message.channel, message.author, "How many would you like to buy?", 100).catch(async () => {
                                                await asleepWarning(message.channel, message.author);
                                            });
                                            
                                            if (isNaN(amount)) {
                                                message.channel.send("Please enter a number!");
                                                continue;
                                            }

                                            //if too expensiv
                                            if (buyOption.cost * amount > await message.client.currency.getBalance(message.author.id)) {
                                                message.channel.send(`You don't have enough ${gravestone}'s, ${message.author.username}`);
                                                continue;   
                                            }
                                            
                                            /*It's sending a message to the user saying that they bought the
                                            rank. */
                                            message.reply(`You bought ${amount} of the badge ${buyOption.itemEmoji}**${buyOption.name}** for ${buyOption.cost * amount}${gravestone}`);
        
                                            /* It's getting the user from the database. */
                                            const user = await Users.findOne({
                                                where: {
                                                    user_id: message.author.id
                                                }
                                            });
                                    
                                            /* It's removing the cost of the item from the user's balance. */
                                            message.client.currency.add(message.author.id, -buyOption.cost * amount);
        
                                            /* It's setting the user's rank and badge to the rank they bought. */
                                            user.badge = buyOption.itemEmoji;
        
                                            /* It's saving the user to the database. */
                                            await user.save();
    
                                            /* Adding the item to the user's inventory. */
                                            const itemInInv = await UserItems.findOne({
                                                where: {
                                                    user_id: message.author.id,
                                                    item_id: buyOption.id,
                                                }
                                            }) || null;

                                            if (itemInInv === null) {
                                                await UserItems.create({
                                                    user_id: message.author.id,
                                                    item_id: buyOption.id,
                                                    amount: amount
                                                });
                                            } else {
                                                itemInInv.amount += parseInt(amount);
                                                await itemInInv.save();
                                            }

                                            /* It's setting the loop to false so it can exit the loop. */
                                            yesLoop = false;
                                            badgeLoop = false;
                                            continue;
                                        }
                                    }
                                    /* It's checking if the user chose the "No" option. If they did, it'll
                                    set rankLoop to false and continue the loop. */
                                    else if (yesNo === false) {
                                        badgeLoop = false;
                                        continue;
                                    } else {
                                        /* It's just a failsafe. If the user somehow gets to this point,
                                        it'll send a message saying that it isn't supposed to happen.
                                        It'll then set all the loops to false and return. */
                                        message.channel.send("This isn't supposed to happen.");
                                        badgeLoop = false;
                                        buyLoop = false;
                                        looping = false;
                                        chooseActionLoop = false;
                                        return;
                                    }
                                }
                                
                                // if they chose more info.
                                if (rankBuyOption === 1) {
                                    const embed = makeEmbed(`Information about ${buyOption.itemEmoji}${buyOption.name}`, "Shop assistant");
                                    
                                    embed.addField("Cost", `${buyOption.cost}${gravestone}`);
                                    embed.addField("Emoji", `${buyOption.itemEmoji}`);
                                    message.channel.send({ embeds: [embed] });
                                    continue;
                                }

                                /* It's checking if the user chose the "Back to rank list" option. If
                                they did, it'll set chooseActionLoop to false and continue the loop. */
                                if (rankBuyOption === 2) {
                                    chooseActionLoop = false;
                                    badgeLoop = false;
                                    continue;
                                }
                            }
                        }
                    }   

                    if (buyChoice === 2) {
                        /* It's creating an empty array where we'll store our embeds. */
                        const embeds = [];

                        /* It's getting all the items from the database that have the category of "Badges". */
                        const items = await Stocks.findAll({
                        }) || null;
    
                        /* It's checking if the items are null. If they are, it'll send a message saying
                        that no badges were found. It'll then set looping to false and return. */
                        if (items === null) {
                            message.channel.send("No stocks were found. (This shouldn't be happening.)");
                            looping = false;
                            return;
                        }
    
                        /* It's creating a variable called embed. It's then looping through all the items
                        in the database. If the item is divisible by 10, it'll create a new embed and
                        push it to the embeds array. It'll then add a field to the embed. */
                        let embed;

                        for (const i in items) {
                            const item = items[i];
                
                            if (i % 10 === 0) {
                                embed = makeEmbed("Stocks", "Graveyard Stock Exchange");
                                embeds.push(embed);  
                            }
                            
                            /* Checking if the price has gone up or down. */
                            let upOrDown;
                            let priceChange;

                            if (item.currentPrice > item.oldPrice) {
                                upOrDown = "+";
                                priceChange = (item.currentPrice / item.oldPrice);

                            } else {
                                upOrDown = "-";
                                priceChange = 100 - ((item.currentPrice / item.oldPrice) * 100);
                                if (priceChange <= 0) {
                                    priceChange *= -1;
                                }
                            }

                            /* Calculating the price change of an item. */
                            const changeRate = priceChange;

                            embed.addField(`${item.name} | ${item.displayName}`, `Current Price: ${item.currentPrice}. ${upOrDown}${Math.round(changeRate)}%`);
                        }
                
                        /* It's paginating the embeds. */
                        paginateEmbeds(message.channel, message.author, embeds, {useDropdown: true});

                        let buyLoop = true;
                        while (buyLoop === true) {
                            /* It's creating a prompt for the user to choose from. */
                            const buyOption = await promptStock(message.channel, message.author, "Which stock would you like to view?").catch(async () => {
                                await asleepWarning(message.channel, message.author);
                            });

                            /* It's checking if the buyOption is null. If it is, it'll send a message
                            saying that the item doesn't exist. It'll then return. */
                            if (!buyOption) {
                                message.channel.send("That stock doesn't exist.");
                                return;
                            }

                            let chooseActionLoop = true;
                            while (chooseActionLoop === true) {
                                const stockBuyOption = await shopOptions(message.channel, message.author, `You are viewing the stock ${buyOption.displayName}`, [
                                    "Buy",
                                    "More info",
                                    "Back to menu",
                                ]).catch(async () => {
                                    await asleepWarning(message.channel, message.author);
                                });

                                // if they chose buy.
                                if (stockBuyOption === 0) {
                                    /* It's checking if the user has enough money to buy the item. If they
                                    don't, it'll send a message saying that they don't have enough money.
                                    It'll then return. */
                                    if (buyOption.currentPrice > await message.client.currency.getBalance(message.author.id)) {
                                        message.channel.send(`You don't have enough ${gravestone}'s, ${message.author.username}`);
                                        continue;   
                                    }
                                    
                                    /* It's creating a prompt for the user to choose from. */
                                    message.channel.send(`${buyOption.displayName} is currently listed for ${buyOption.currentPrice}${gravestone}'s each.`);
                                    const yesNo = await areYouSure(message.channel, message.author).catch(async () => {
                                        await asleepWarning(message.channel, message.author);
                                    });
                                    
                                    // if they chose yes on the yes/no prompt, 
                                    // adds the badge to the user and removes the corresponding amount of money.
                                    if (yesNo === true) {
                                        let yesLoop = true;
                                        while (yesLoop === true) {
                                            const amount = await inputText(message.channel, message.author, "How many shares would you like to buy?", 100).catch(async () => {
                                                await asleepWarning(message.channel, message.author);
                                            });
                                            
                                            if (isNaN(amount)) {
                                                message.channel.send("Please enter a number!");
                                                continue;
                                            }

                                            //if too expensiv
                                            if (buyOption.currentPrice * amount > await message.client.currency.getBalance(message.author.id)) {
                                                message.channel.send(`You don't have enough ${gravestone}'s, ${message.author.username}`);
                                                continue;   
                                            }

                                            /*It's sending a message to the user saying that they bought the
                                            rank. */
                                            message.reply(`You bought ${amount} of the stock **${buyOption.displayName}** for ${buyOption.currentPrice * amount}${gravestone}'s`);
        
                                            /* It's getting the user from the database. */
                                            const shareInDb = await UserPortfolio.findOne({
                                                where: { user_id: message.author.id, share_id: buyOption.id}
                                            });
                                        
                                            /* Checking if the user has the share in their portfolio,
                                            if they do it adds the amount they bought to the amount
                                            they already have, if they don't it creates a new entry
                                            in the database. */
                                            if (shareInDb) {
                                                shareInDb.amount += parseInt(amount);
                                                await shareInDb.save();
                                            } else {
                                                await UserPortfolio.create({ user_id: message.author.id, share_id: buyOption.id, amount: amount});
                                            }
                                        
                                            /* It's removing the cost of the item from the user's balance. */
                                            message.client.currency.add(message.author.id, -buyOption.currentPrice * amount);
    
                                            /* Updating the amountBought and currentPrice of the stock. */
                                            const stockPrice = parseInt(buyOption.currentPrice);
                                            const newStockPrice = stockPrice + buyOption.currentPrice / 10;
                                    
                                            const currentAmountBought = buyOption.amountBought;
                                            const amountToIncrease = currentAmountBought + buyOption.currentPrice / 10;
                                    
                                            await Stocks.update({ amountBought: amountToIncrease }, { where: { id: buyOption.id } });
                                    
                                            await Stocks.update({ oldPrice: buyOption.currentPrice }, { where: { id: buyOption.id } });
                                            await Stocks.update({ currentPrice: newStockPrice }, { where: { id: buyOption.id } });

                                            /* It's setting the loop to false so it can exit the loop. */
                                            yesLoop = false;
                                            chooseActionLoop = false;
                                            continue;
                                        }
                                    }
                                    /* It's checking if the user chose the "No" option. If they did, it'll
                                    set rankLoop to false and continue the loop. */
                                    else if (yesNo === false) {
                                        chooseActionLoop = false;
                                        continue;
                                    } else {
                                        /* It's just a failsafe. If the user somehow gets to this point,
                                        it'll send a message saying that it isn't supposed to happen.
                                        It'll then set all the loops to false and return. */
                                        message.channel.send("This isn't supposed to happen.");
                                        buyLoop = false;
                                        looping = false;
                                        chooseActionLoop = false;
                                        return;
                                    }
                                }

                                // if they chose more info.
                                if (stockBuyOption === 1) {
                                    const embed = makeEmbed(`Information about ${buyOption.displayName}`, "Stock assistant");
                                    
                                    embed.addField("Current Price", `${buyOption.currentPrice}${gravestone}`);
                                    embed.addField("Old price", `${buyOption.oldPrice}${gravestone}`);
                                    embed.addField("Average change rate", `${buyOption.averageChange}%`);
                                    message.channel.send({ embeds: [embed] });
                                    continue;
                                }

                                /* Checking if the user has selected the option to buy stock. */
                                if (stockBuyOption === 2) {
                                    chooseActionLoop = false;
                                    buyLoop = false;
                                    continue;
                                }
                            }
                        }
                    }

                    /* Checking if the user has chosen the number 3. If they have, it will run the
                    function chooseItem. */
                    if (buyChoice === 3) {
                        await chooseItem(message.channel, message.author, "Food", message.client, message.author);
                    }

                    /* Checking if the user has chosen the 4th option in the embed. */
                    if (buyChoice === 4) {
                        await chooseItem(message.channel, message.author, "Cats", message.client, message.author);
                    }

                    /* Checking if the user has chosen the number 5. If they have, it will run the
                    function chooseItem. */
                    if (buyChoice === 5) {
                        await chooseItem(message.channel, message.author, "Dogs", message.client, message.author);
                    }

                    /* Checking if the user has chosen the number 5. If they have, it will run the
                    function chooseItem. */
                    if (buyChoice === 6) {
                        await chooseItem(message.channel, message.author, "Special", message.client, message.author);
                    }

                    /* It's checking if the user chose the "Back to menu" option. If they did, it'll
                    continue the loop. */
                    if (buyChoice === 7) {
                        buyLoop = false;
                        continue;
                    }
                }
            }

            if (startChoice === 1) {
                /* Asking the user which item they would like to sell. */
                const itemChosen = await promptItem(message.channel, message.author, "Which item would you like to sell?");

                /* Checking if the item exists in the database. */
                const item = await CurrencyShop.findOne({
                    where: {
                        id: itemChosen.item_id
                    }
                }) || null;

                if (item === null) return message.channel.send("This item does not exist.");

                let chooseActionLoop = true;
                while (chooseActionLoop === true) {
                    const itemActionOption = await shopOptions(message.channel, message.author, `You are viewing the item ${item.name}`, [
                        "Sell",
                        "More info",
                        "Back to menu",
                    ]).catch(async () => {
                        await fellAsleep(message.channel, message.author);
                        looping = false;
                    });

                    if (itemActionOption === 0) {
                        /* Asking the user if they are sure they want to do something. */
                        const yesNo = await areYouSure(message.channel, message.author).catch(async () => {
                            await asleepWarning(message.channel, message.author);
                        });

                        if (yesNo === true) {
                            let maybeLoop = true;
                            while (maybeLoop === true) {
                                const amount = await inputText(message.channel, message.author, "How much of this item would you like to sell?", 100).catch(async () => {
                                    await asleepWarning(message.channel, message.author);
                                });
                                
                                /* Checking if the amount is a number. */
                                if (isNaN(amount)) {
                                    message.channel.send("Please enter a number!");
                                    continue;
                                }

                                /* It's getting the user from the database. */
                                const itemInDb = await UserItems.findOne({
                                    where: { user_id: message.author.id, item_id: item.id}
                                }) || null;

                                /* Checking if the item is in the database. */
                                if (itemInDb === null) {
                                    message.channel.send("Item wasn't found.");
                                    continue;
                                }

                                /* Checking if the amount of the item the user wants to sell is more
                                than the amount of the item the user has. */
                                if (amount > itemInDb.amount) {
                                    message.channel.send("You don't have that much of this item.");
                                    continue;
                                }

                                /*It's sending a message to the user saying that they bought the
                                rank. */
                                message.reply(`You sold ${amount} of the item **${item.name}** for ${item.cost * amount}${gravestone}'s`);

                                itemInDb.amount -= amount;
                                itemInDb.save();

                                // add the money of the item to the user
                                message.client.currency.add(message.author.id, item.cost * amount);

                                // check if the item should be deleted (saves space)
                                const newItemInDb = await UserItems.findOne({
                                    where: {
                                        user_id: message.author.id,
                                        item_id: item.id
                                    }
                                }) || null;

                                if (newItemInDb === null) {
                                    message.channel.send("Item wasn't found.");
                                }

                                if (newItemInDb.amount <= 0) {
                                    newItemInDb.destroy();
                                    newItemInDb.save();
                                }

                                maybeLoop = false;
                                continue;
                            }
                        }

                        if (yesNo === false) {
                            // this just goes back to the menu.
                            continue;
                        }
                    } 

                    if (itemActionOption === 1) {
                        /* Creating an embed with the item's name, cost, and emoji. */
                        const embed = makeEmbed(`Information about ${item.name}`, "Shop assistant");
                                    
                        embed.addField("Cost", `${item.cost}${gravestone}`);
                        embed.addField("Emoji", `${item.itemEmoji}`);
                        message.channel.send({ embeds: [embed] });
                        continue;
                    }

                    /* Checking if the user has chosen to exit the loop. */
                    if (itemActionOption === 2) {
                        chooseActionLoop = false;
                        continue;
                    }
                }
            }
            
            /* It's checking if the user chose the "Finish" option. If they did, it'll set looping to
            false and return. */
            if (startChoice === 2) {
                looping = false;
                message.channel.send("Exiting the shop...");
                return;
            }
        }
    }
};