const { UserProfiles } = require(`${__basedir}/db_objects`);

/* Importing the inputText function from the utities folder. */
const { inputText, isUsernameTaken, characterExists } = require(`${__basedir}/utilities`);

module.exports = {
    name: ["createprofile"],
    description: "Create a profile for the interactive fighting system!",
    usage: [],

    async execute(message) {
        /* Checking if the user already has a profile. */
        if (await characterExists(message.author.id) === true) return message.channel.send("You already have a profile!");

        message.channel.send("You are about to embark on a massive journy on beating up grannies and homeless people. All you have to do to start is to give your character a name!\nNOTE: You can only change your name once every two weeks, so make it a good one!");

        /* A function that is imported from the utities folder. It is a function that asks the user for
        input. */
        const username = await inputText(message.channel, message.author, "What will your name be?", 20);

        // if the username is already taken
        if (await isUsernameTaken(username) === true) return message.channel.send("This username is already taken.");

        /* Creating a new user profile. */
        else {
            await UserProfiles.create({
                user_id: message.author.id,
                username: username
            });

            message.channel.send("Profile created. Your adventure starts here!");
        }   
    }

};