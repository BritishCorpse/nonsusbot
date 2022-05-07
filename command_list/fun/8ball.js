module.exports = {
    name: ["8ball"],
    description: "Let the 8ball guide you!",
    usage: [],
    execute(message, args) {
        if (!args[0]) return message.channel.send("No question given.");

        const answer = Math.floor(Math.random() * 6);
        
        const answers = {
            0: "Yes.",
            1: "No",
            2: "Maybe.",
            3: "I cannot answer at this time.",
            4: "I'm not quite sure.",
            5: "Definitely."
        };

        message.channel.send(`${answers[answer]}`);
    }
};