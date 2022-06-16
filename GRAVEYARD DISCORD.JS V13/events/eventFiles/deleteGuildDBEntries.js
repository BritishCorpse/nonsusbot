const { guildCount } = require("../../db_objects");
const { sendError } = require("../../utilities/sendError");

module.exports = {
    async execute(graveyard, guild) {
        //* guildCount
        await guildCount.destroy({ where: { guildId: guild.id } }).catch(async error => {await sendError(error);});
    }
};