const { Stocks } = require(`${__basedir}/db_objects`);

async function doDaily() {
    const stocks = await Stocks.findAll();

    console.log(`Initiating stock price update at: ${Date()}`);
    for (const i in stocks) {

        const upOrDown = Math.floor(Math.random() * 3);

        const stock = stocks[i];

        const averageChange = Number.parseInt(stock.averageChange);

        const currentPrice = Number.parseInt(stock.currentPrice);

        const stockChange = currentPrice * averageChange / 100;

        if (upOrDown === 0) {
            const newPrice = Math.round(currentPrice - stockChange);

            await Stocks.update({ oldPrice: stock.currentPrice}, { where: { id: stock.id }});
            await Stocks.update({ currentPrice: newPrice }, { where: { id: stock.id } });
        }

        else {
            const newPrice = Math.round(currentPrice + stockChange);

            await Stocks.update({ oldPrice: stock.currentPrice}, { where: { id: stock.id }});
            await Stocks.update({ currentPrice: newPrice }, { where: { id: stock.id } });
        }
    }

    await Stocks.update({ lastUpdated: Date.now() }, { where: { id: 1000 } });


    console.log(`Stocks have finished updated at: ${Date()}`);
}

//have a for loop to check for each item in currency shops, then check its category, then have a if else chain to see if it maches any affected category, if it matches a category, call a function to determine its new price.

module.exports = {
    name: "stocks",
    execute (client) {
        client.on("messageCreate", async () => {
            const itemInDb = await Stocks.findOne({ where: { id: 1000} });

            if (itemInDb === null) return; // fixes crash when itemInDb doesn't exist

            const time = Date.now();

            if (itemInDb.lastUpdated === null) {
                await Stocks.update({ lastUpdated: time - 86400000 }, { where: { id: 1000 } });
            }

            if (itemInDb.lastUpdated < time - 86400000) {
                await doDaily();
            }
        });
    }
};
