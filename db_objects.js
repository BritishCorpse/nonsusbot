const Sequelize = require("sequelize"); // make sure that this is up to date. old version might have issues

const sequelize = new Sequelize("database", "username", "password", {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: "database.sqlite",
});

const Users = require("./models/Users")(sequelize, Sequelize.DataTypes);
const CurrencyShop = require("./models/CurrencyShop")(sequelize, Sequelize.DataTypes);
const UserItems = require("./models/UserItems")(sequelize, Sequelize.DataTypes);
const Stocks = require("./models/Stocks")(sequelize, Sequelize.DataTypes);
const UserPortfolio = require("./models/UserPortfolio")(sequelize, Sequelize.DataTypes);

UserPortfolio.belongsTo(Stocks, {foreignKey: "id", as: "stock"}); // explained in next line
UserItems.belongsTo(CurrencyShop, { foreignKey: "item_id", as: "item" }); // foreignKey sets the key to be used from UserItems to look up in CurrencyShop


Users.prototype.addItem = async function(item) { // function is used instead of arrow function to be able to use the "this" variable
    const userItem = await UserItems.findOne({
        where: { user_id: this.user_id, item_id: item.id },
    });

    if (userItem) {
        userItem.amount += 1;
        return userItem.save();
    }

    return UserItems.create({ user_id: this.user_id, item_id: item.id, amount: 1 });
};

Users.prototype.getItems = function() {
    return UserItems.findAll({
        where: { user_id: this.user_id },
        include: ["item"],
    });
};

Users.prototype.getUserPortfolio = function() {
    return UserPortfolio.findAll({
        where: { user_id: this.user_id },
        include: ["id"],
    });
};

module.exports = { Users, CurrencyShop, UserItems, Stocks };
