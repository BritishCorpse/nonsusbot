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
const Levels = require("./models/Levels")(sequelize, Sequelize.DataTypes);
const Counting = require("./models/Counting")(sequelize, Sequelize.DataTypes);

const SelfRoleChannels = require("./models/SelfRoleChannels")(sequelize, Sequelize.DataTypes);
const SelfRoleMessages = require("./models/SelfRoleMessages")(sequelize, Sequelize.DataTypes);
const SelfRoleCategories = require("./models/SelfRoleCategories")(sequelize, Sequelize.DataTypes);
const SelfRoleRoles = require("./models/SelfRoleRoles")(sequelize, Sequelize.DataTypes);

const AutoRoleRoles = require("./models/AutoRoleRoles")(sequelize, Sequelize.DataTypes);

UserPortfolio.belongsTo(Stocks, { foreignKey: "share_id", as: "shares" });
UserItems.belongsTo(CurrencyShop, { foreignKey: "item_id", as: "item" }); // foreignKey sets the key to be used from UserItems to look up in CurrencyShop

// table relationships for the self role system (the ones that aren't used, but could be in the future, are commented out)
//SelfRoleRoles.belongsTo(SelfRoleCategories, { foreignKey: "category_id", as: "category" });
//SelfRoleCategories.belongsTo(SelfRoleChannels, { foreignKey: "guild_id", as: "channel" });
SelfRoleCategories.hasMany(SelfRoleRoles, { sourceKey: "id", foreignKey: "category_id", as: "roles" });
//SelfRoleChannels.hasMany(SelfRoleMessages, { sourceKey: "channel_id", foreignKey: "channel_id", as: "messages" });
SelfRoleMessages.hasOne(SelfRoleCategories, { sourceKey: "category_id", foreignKey: "id", as: "category" });

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

Levels.prototype.addLevel = async function() {
    const userInDb = await Levels.findOne({
        where: { userId: this.userId, guildID: this.guildId }
    });

    if (userInDb.level) {
        console.log(userInDb.level);
        userInDb.level += 1;
        return userInDb.save();
    }

    userInDb.level = 1;
    return userInDb.save();
};

Users.prototype.getItems = function() {
    return UserItems.findAll({
        where: { user_id: this.user_id },
        include: ["item"],
    });
};

Levels.prototype.setReqExp = async function() {
    const userInDb = await Levels.findOne({
        where: { userId: this.userId, guildId: this.guildID }
    });

    if (userInDb.reqexp) {
        userInDb.reqexp = userInDb.level * 1000;
        return userInDb.save();
    }

    userInDb.reqexp = 1000;
    return userInDb.save();
};

module.exports = {
    Users,

    CurrencyShop,
    UserItems,

    Stocks,
    UserPortfolio,

    Levels,

    Counting,

    SelfRoleChannels,
    SelfRoleMessages,
    SelfRoleCategories,
    SelfRoleRoles,
    
    AutoRoleRoles,
};
