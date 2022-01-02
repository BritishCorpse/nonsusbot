const { Op } = require('sequelize');
const { Users } = require(`${__basedir}/db_objects`);

module.exports = {
    name: 'createbadge',
    description: "hey",

    usage: [
    ],
    async execute(message, args) {
        let userId = message.author.id;
        let userBadge = args.slice(1).join(" ");

        await Users.update({ badge: userBadge }, { where: { user_id: userId } });
    }
}