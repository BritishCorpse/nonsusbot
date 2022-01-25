const { Users } = require(`${__basedir}/db_objects`);
const developmentConfig = require(`${__basedir}/development_config.json`);

module.exports = {
    name: "addexp",
    execute(client) {
        client.on("messageCreate", async message => {

            if (message.author.bot && !testing) return;
            if (message.author.bot && testing && message.author.id !== developmentConfig.testing_bot_discord_user_id) return;

            //find user, give user 1 exp, check reqexp, if exp >= reqexp, level ++;
            const userInDb = await Users.findOne({
                where: { user_id: message.author.id }
            });

            await userInDb.addExp();

            if (userInDb.exp >= userInDb.reqexp) {
                await userInDb.addLevel();

                await userInDb.setReqExp();

                const levelChannel = client.channels.cache.get(client.serverConfig.get(message.guild.id).levelup_channel_id);

                levelChannel.send(`${message.author.username} has reached level ${userInDb.level}!`);
            }
        });
    }
};