const Sequelize = require('sequelize');

const sequelize = new Sequelize('currency_database', 'username', 'password', {
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
		CurrencyShop.upsert({ name: 'Coke E Cola', cost: 3 }),
		CurrencyShop.upsert({ name: 'Bible', cost: 20 }),
		CurrencyShop.upsert({ name: "Biblically Accurate Angel", cost: 5000000 }),
		CurrencyShop.upsert({ name: 'Angel', cost: 777 }),
		CurrencyShop.upsert({ name: 'Demon', cost: 666 }),
		CurrencyShop.upsert({ name: 'Lost Soul', cost: 10000 }),
		CurrencyShop.upsert({ name: 'Doritoes', cost: 7000 }),
		CurrencyShop.upsert({ name: 'Tendies', cost: 5000 }),
		CurrencyShop.upsert({ name: 'VIP pass', cost: 10000000 }),
		CurrencyShop.upsert({ name: 'Casino Membership', cost: 1000 }),
		CurrencyShop.upsert({ name: 'Typical Femoid', cost: 1000 }),
		CurrencyShop.upsert({ name: 'One third of an amazon stock', cost: 1125 }),
		CurrencyShop.upsert({ name: 'Joe Biden', cost: 2943529411764 }),
		CurrencyShop.upsert({ name: 'Poppy', cost: 2 }),
		CurrencyShop.upsert({ name: 'Dandelion', cost: 3 }),
		CurrencyShop.upsert({ name: '1.5 chicken nuggets', cost: 5 }),
		CurrencyShop.upsert({ name: 'Catholic cross', cost: 40 }),
		CurrencyShop.upsert({ name: 'Wooden plank', cost: 20 }),
		CurrencyShop.upsert({ name: 'Dog (No breed)', cost: 100 }),
		CurrencyShop.upsert({ name: 'Dog (Shepherd)', cost: 500 }),
		CurrencyShop.upsert({ name: 'Dog (Labrador)', cost: 354 }),
		CurrencyShop.upsert({ name: 'Dog (Pomeranian)', cost: 700}),
		CurrencyShop.upsert({ name: 'Dog (Poodle)', cost: 1000}),
		CurrencyShop.upsert({ name: 'Dog (Shiba)', cost: 1600}),
		CurrencyShop.upsert({ name: 'Cat (No color)', cost: 10}),
		CurrencyShop.upsert({ name: 'Cat (Black)', cost: 100}),
		CurrencyShop.upsert({ name: 'Cat (Oraeang)', cost: 200}),
		CurrencyShop.upsert({ name: 'Cat (Gray)', cost: 150}),
		CurrencyShop.upsert({ name: 'Cat (White)', cost: 200}),
		CurrencyShop.upsert({ name: 'Cat (Brown)', cost: 160}),
		CurrencyShop.upsert({ name: 'Cat (Red)', cost: 1000}),
		CurrencyShop.upsert({ name: 'Cat (Manta)', cost: 10000}),
		CurrencyShop.upsert({ name: 'Dog (Chloe)', cost: 10000}),
		CurrencyShop.upsert({ name: 'Chicken', cost: 748485395}),
		CurrencyShop.upsert({ name: 'Cracker', cost: 1}),
		CurrencyShop.upsert({ name: 'Chinese food', cost: 10})
	];
	await Promise.all(shop);
	console.log('Currency database synced.');

	sequelize.close()
}).catch(console.error);
