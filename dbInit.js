const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const CurrencyShop = require('./models/CurrencyShop')(sequelize, Sequelize.DataTypes);
require('./models/Users')(sequelize, Sequelize.DataTypes);
require('./models/UserItems')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	const shop = [
		CurrencyShop.upsert({ name: 'Cookie', cost: 1 }),
		CurrencyShop.upsert({ name: 'Premium Cookie', cost: 100 }),
		CurrencyShop.upsert({ name: 'Coke E Cola', cost: 3}),
		CurrencyShop.upsert({ name: 'Bible', cost: 20 }),
		CurrencyShop.upsert({ name: "Biblically Accurate Angel", cost: 5000000 }),
		CurrencyShop.upsert({ name: 'Demon', cost: 666}),
		CurrencyShop.upsert({ name: 'Lost Soul', cost: 10000}),
		CurrencyShop.upsert({ name: 'Doritoes', cost: 7000}),
		CurrencyShop.upsert({ name: 'Rank Upgrade', cost: 1000000}),
		CurrencyShop.upsert({ name: 'Tendies', cost: 5000}),
		CurrencyShop.upsert({ name: 'VIP pass', cost: 1}) //Change cost later to 10 million coins
	];
	await Promise.all(shop);
	console.log('Database synced');
	sequelize.close();
}).catch(console.error);