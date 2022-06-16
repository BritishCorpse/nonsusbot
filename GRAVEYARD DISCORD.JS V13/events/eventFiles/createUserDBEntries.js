const { userCount, userCurrency, userInformation } = require("../../db_objects");
const { sendError } = require("../../utilities/sendError");

module.exports = {
    async execute(graveyard, user) {
        //* userCount
        await userCount.create({ userId: user.id }).catch(async error => {await sendError(error);});

        //* userCurrency
        await userCurrency.create({ userId: user.id }).catch(async error => {await sendError(error);});

        //* userInfomation
        await userInformation.create({ userId: user.id }).catch(async error => {await sendError(error);});
    }
};