const { Stocks } = require(`${__basedir}/db_objects`);
 

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
}


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

            if (time - 86400000 > itemInDb.lastUpdated) {
                await doDaily();
            }
        });
    }
};
