const { Users } = require(`${__basedir}/db_objects`);
const { gravestone } = require(`${__basedir}/emojis.json`);

module.exports = {
    name: ["work"],
    description: "Work a random job for some quick cash.",
    usage: [

    ],
    async execute(message) {
        const d = new Date();
        const time = d.getTime();
        console.log(time);

        const userInDb = await Users.findOne({ where: { user_id: message.author.id } });

        if (userInDb.lastWorked === null) {
            await Users.update({ lastWorked: time - 3600000 }, { where: { user_id: message.author.id } });
        }

        // Make sure they cant claim again in 7 days
        if (time - 3600000 < userInDb.lastWorked) {
            message.channel.send("WOAH WOAH SLOW DOWN! You're overworked! It hasn't been an hour since you last worked!");
            return;
        }

        const jobs = ["Doctor",
            "Fireman",
            "Police",
            "Programmer", 
            "Teacher", 
            "Burger flipper", 
            "Underpaid Amazon worker", 
            "Entrepreneur", 
            "Backend web developer", 
            "Keyboard warrior", 
            "Pro E-sports player", 
            "Football(European) player",
            "Basketball player"
        ];

        const jobIndex = Math.floor(Math.random() * jobs.length);
        
        let earnedMoney = Math.floor(Math.random() * 300) + 100;

        const bonusChance = Math.floor(Math.random() * 3);

        if (bonusChance === 1) {
            earnedMoney += 1000;
        }

        message.client.currency.add(message.author.id, earnedMoney);
        await Users.update({ lastWorked: time }, { where: { user_id: message.author.id } });

        message.channel.send(`You earned ${earnedMoney}${gravestone} working as (${jobs[jobIndex]})`);
    }

};
