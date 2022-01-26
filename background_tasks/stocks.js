const { Stocks, CurrencyShop } = require(`${__basedir}/db_objects`);
 
async function badge(itemId) {
    const badgeStock = await Stocks.findOne({ where: { id: 161 }});

    const badge = await CurrencyShop.findOne({ where: { id: itemId } });

    const randomChange = Math.floor(Math.random() * 4000);
    await CurrencyShop.update({ cost: Math.round(badge.cost + parseInt(badgeStock.currentPrice) + randomChange) }, { where: { id: badge.id }});

}

async function cat(itemId) {
    const catStock = await Stocks.findOne({ where: { id: 162}});

    const cat = await CurrencyShop.findOne({ where: { id: itemId } });

    const randomChange = Math.floor(Math.random() * 100);
    await CurrencyShop.update({ cost: Math.round(cat.cost + parseInt(catStock.currentPrice) + randomChange) }, { where: {id: cat.id }});
}

async function dog(itemId) {
    const dogStock = await Stocks.findOne({ where: { id: 163}});

    const dog = await CurrencyShop.findOne({ where: { id: itemId } });

    const randomChange = Math.floor(Math.random() * 400);
    await CurrencyShop.update({ cost: Math.round(dog.cost + parseInt(dogStock.currentPrice) + randomChange) }, { where: { id: dog.id }});
}

async function food(itemId) {
    const foodStock = await Stocks.findOne({ where: { id: 164 }});

    const food = await CurrencyShop.findOne({ where: { id: itemId } });

    const randomChange = Math.floor(Math.random() * 50);
    await CurrencyShop.update({ cost: Math.round(food.cost + parseInt(foodStock.currentPrice) + randomChange) }, { where: { id: food.id }});
}

async function doDaily() {
    const stocks = await Stocks.findAll();

    for (const i in stocks) {

        const upOrDown = Math.floor(Math.random() * 3);

        const stock = stocks[i];

        const averageChange = Number.parseInt(stock.averageChange);

        const currentPrice = Number.parseInt(stock.currentPrice);

        const stockChange = currentPrice * averageChange / 100;

        if (upOrDown === 0) {
            const newPrice = Math.round(currentPrice - stockChange);
            console.log(`-${newPrice}, ${stock.id}`);

            await Stocks.update({ oldPrice: stock.currentPrice}, { where: { id: stock.id }});
            await Stocks.update({ currentPrice: newPrice }, { where: { id: stock.id } });
        }

        else {
            const newPrice = Math.round(currentPrice + stockChange);
            console.log(`+${newPrice}, ${stock.id}`);

            await Stocks.update({ oldPrice: stock.currentPrice}, { where: { id: stock.id }});
            await Stocks.update({ currentPrice: newPrice }, { where: { id: stock.id } });
        }
    }

    await Stocks.update({ lastUpdated: new Date().getTime() }, { where: { id: 1 } });

    // Do currencyshops stuff.

    const shop = await CurrencyShop.findAll();

    for (const i in shop) {
        const item = shop[i];

        if (item.category === "Badges") {
            console.log("badge");
            await badge(item.id);
        }

        else if (item.category === "Cats") {
            console.log("cat");
            await cat(item.id);
        }

        else if (item.category === "Dogs") {
            console.log("dog");
            await dog(item.id);
        }

        else if (item.category === "Food") {
            console.log("food");
            await food(item.id);
        }
    }
}

//have a for loop to check for each item in currency shops, then check its category, then have a if else chain to see if it maches any affected category, if it matches a category, call a function to determine its new price.

module.exports = {
    name: "stocks",
    execute (client) {
        client.on("messageCreate", async () => {
            const itemInDb = await Stocks.findOne({ where: { id: 1} });
            if (itemInDb === null) return; // fixes crash when itemInDb doesn't exist

            const time = new Date().getTime();

            if (itemInDb.lastUpdated === null) {
                await Stocks.update({ lastUpdated: time - 86400000 }, { where: { id: 1 } });
            }

            if (time - 84600000 > itemInDb.lastUpdated) {
                await doDaily();
            }
        });
    }
};
