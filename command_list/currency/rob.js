const { Users } = require(`${__basedir}/db_objects`);

module.exports = {
    name: "rob",
    description: "Rob a user.",
    usage: [],
    
    async execute(message) {
        const target = message.mentions.users.first();
        const userInDb = await Users.findOne({ where: { user_id: message.author.id } });

        const amount = Math.floor(Math.random() * 50) + 300;

        if (!target) {
            return message.reply("You robbed yourself! +0<:ripcoin:929759319296192543>");
        }
        if (amount > message.client.currency.getBalance(target.id)) {
            message.channel.send("This user is too poor to be robbed!");
            return;
        }


        const d = new Date();
        const time = d.getTime();

        if (userInDb.lastRobbed === null) {
            await Users.update({ lastRobbed: time - 3600000 }, { where: { user_id: target.id } });
        }

        if (time - 3600000 < userInDb.lastRobbed) {
            return message.channel.send("Let a dead man rest! It hasn't been an hour since this person was last robbed!");
        }

        const result = Math.floor(Math.random() * 3);
        if (result === "0") {
            message.channel.send(`${target} caught you stealing! You paid them ${amount}<:ripcoin:929759319296192543>`);

            message.client.currency.add(target.id, amount);
            message.client.currency.add(message.author.id, -amount);
            return;
        }

        message.channel.send(`You robbed ${target} and got ${amount}<:ripcoin:929759319296192543>`);

        message.client.currency.add(target.id, -amount);
        message.client.currency.add(message.author.id, amount);

    }
};