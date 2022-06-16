const { userCount, userCurrency, userInformation } = require("../../db_objects");
const { sendError } = require("../../utilities/sendError");

module.exports = {
    async execute(graveyard, user) {
        //* userCount
        await userCount.destroy({ where: { userId: user.id } }).catch(async error => {await sendError(error);});

        //* userCurrency
        await userCurrency.destroy({ where: { userId: user.id } }).catch(async error => {await sendError(error);});

        //* userInfomation
        await userInformation.destroy({ where: { userId: user.id } }).catch(async error => {await sendError(error);});
    }
};