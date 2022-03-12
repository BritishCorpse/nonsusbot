const { MessageEmbed } = require("discord.js");
const redditjokes = require(`${__basedir}/data/jokes/reddit_jokes.json`);
const stupidstuff = require(`${__basedir}/data/jokes/stupidstuff.json`);
const wocka = require(`${__basedir}/data/jokes/wocka.json`);
const jokes = redditjokes.concat(stupidstuff, wocka);

//const offensive = ["horny", "penis", "vagine", "dick", "cock", "sex", "porn", "screw", "baby", "racist", "semen", "fuck", "shit", "sperm"];
const offensive = [];

module.exports = {
    name: "joke",
    description: "Finds a joke from the database, then sends it in the channel.",
    botPermissions: ["ADD_REACTIONS"],

    usage: [
    ],

    execute (message) {
        //let joke_length = 0;
        let content = "";
        let good_joke = false;

        let index;
        do {
            index = Math.floor(Math.random() * jokes.length);
            content = (jokes[index].body + jokes[index].title).replace(/(\s){2,}/g, "$1"); // remove duplicate spaces and new lines
          
            if (content.length <= 2048 && content.length > 0 && content !== undefined && content !== "") {
                good_joke = true;
            }

            for (const word of offensive) {
                if (content.toLowerCase().includes(word)) {
                    good_joke = false;
                }
            }

        } while (!good_joke); // to stop it from giving jokes that are too long

        const embed = new MessageEmbed()
            .setTitle(jokes[index].title)
            .setDescription(jokes[index].body)
            .setColor("ORANGE");

        message.channel.send({embeds: [embed]}) .then(sentMessage => {
            sentMessage.react("👍");
            sentMessage.react("👎");
        });
    }
};
