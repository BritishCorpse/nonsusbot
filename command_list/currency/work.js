module.exports = {
    name: "work",
    description: "Work a random job for some quick cash.",
    usage: [

    ],

    execute(message) {

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
        
        const earnedMoney = Math.floor(Math.random() * 300) + 100;

        const bonusChance = Math.floor(Math.random() * 3);

        if (bonusChance === 1) {
            earnedMoney + 1000;
        }

        message.channel.send(`You earned ${earnedMoney}💰 working as (${jobs[jobIndex]})`);
    }

}