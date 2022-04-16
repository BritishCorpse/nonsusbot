const { Users } = require(`${__basedir}/db_objects`);
const { gravestone } = require(`${__basedir}/emojis.json`);

module.exports = {
    name: ["rob"],
    description: "Robs a user.",
    usage: [],
    
    async execute(message) {
        const target = message.mentions.users.first();
        const amount = Math.floor(Math.random() * 50) + 300;

        const d = new Date();
        const time = d.getTime();

        if (!target || target.id === message.author.id) {
            message.reply("You robbed yourself! +0${gravestone}");
            return;
        }

        const userInDb = await Users.findOne({ where: { user_id: target.id } });

        if (amount > message.client.currency.getBalance(target.id)) {
            message.channel.send("This user is too poor to be robbed!");
            return;
        }

        if (userInDb.lastRobbed === null) {
            await Users.update({ lastRobbed: time - 3600000 }, { where: { user_id: target.id } });
        }

        if (time - 3600000 < userInDb.lastRobbed) {
            message.channel.send("Don't beat them while they're down! This person has already been robbed in the past 60 minutes.");
            return;
        }

        const result = Math.floor(Math.random() * 3);
        if (result === 0) {
            message.channel.send(`${target} caught you stealing! You paid them ${amount}${gravestone}`);

            message.client.currency.add(target.id, amount);
            message.client.currency.add(message.author.id, -amount);
            return;
        }

        message.channel.send(`You robbed ${target} and got ${amount}${gravestone}`);

        message.client.currency.add(target.id, -amount);
        message.client.currency.add(message.author.id, amount);

        await Users.update({ lastRobbed: time }, { where: { user_id: target.id } });
    }
};
