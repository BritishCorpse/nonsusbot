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

UserPortfolio.belongsTo(Stocks, { foreignKey: "share_id", as: "shares" });
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

Users.prototype.addShare = async function(share) {
    const shareInDb = await UserPortfolio.findOne({
        where: { user_id: this.user_id, share_id: share.id}
    });

    if (shareInDb) {
        shareInDb.amount += 1;
        return shareInDb.save();
    }

    return UserPortfolio.create({ user_id: this.user_id, share_id: share.id, amount: 1});
};

Users.prototype.addLevel = async function() {
    const userInDb = await Users.findOne({
        where: { user_id: this.user_id }
    });

    if (userInDb.level) {
        console.log(userInDb.level);
        userInDb.level += 1;
        return userInDb.save();
    }

    userInDb.level = 1;
    return userInDb.save();
};

Users.prototype.addExp = async function() {
    const userInDb = await Users.findOne({
        where: { user_id: this.user_id }
    });

    if (userInDb.exp) {
        userInDb.exp += 1;
        return userInDb.save();
    }

    userInDb.exp = 1;
    return userInDb.save();
};

Users.prototype.setReqExp = async function() {
    const userInDb = await Users.findOne({
        where: { user_id: this.user_id }
    });

    if (userInDb.reqexp) {
        userInDb.reqexp = userInDb.level * 1000;
        return userInDb.save();
    }

    userInDb.reqexp = 1000;
    return userInDb.save();
};

Users.prototype.getItems = function() {
    return UserItems.findAll({
        where: { user_id: this.user_id },
        include: ["item"],
    });
};

module.exports = { Users, CurrencyShop, UserItems, Stocks, UserPortfolio };
