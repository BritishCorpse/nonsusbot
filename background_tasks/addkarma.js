const { SuggestionMessages, UserKarma } = require(`${__basedir}/db_objects.js`); 

const { infoLog } = require(`${__basedir}/utilities`);

module.exports = {
    name: "addkarma", 
    async execute(client) {
        client.on("messageReactionAdd", async (messageReaction) => {
            const reactionMessage = await SuggestionMessages.findOne({
                where: {
                    message_id: messageReaction.message.id
                }
            }) || null;
            
            // this checks for if the message exists in the database.
            if (reactionMessage === null) return;

            // this checks for the age of the suggestion, if its more than a week old, delete the message from the database.
            // this removed unnecessary clutter, helps reduce disk usage, makes things a bit faster and allows users to receive only a certain amount of karma per suggestion.
            if (reactionMessage.sent_at < Date.now() - 86400000 * 7) {
                reactionMessage.destroy({
                    where: {
                        message_id: messageReaction.message.id
                    }
                }); 

                infoLog("Deleted a database entry", `${__dirname}/${__filename}.js`, "CLIENT-INFO");
            }


            // the next if statements in this indent check for what kind of emoji was reacted with
            // if the emoji is an "upvote" you add 1 karma, and if its a downvote you remove 1 karma, otherwise just return.
            if (messageReaction.emoji.name === "🟩") {
                const userInDb = await UserKarma.findOne({
                    where: {
                        user_id: reactionMessage.user_id
                    }
                }) || null;

                if (userInDb === null) {
                    const userInDb2 = await UserKarma.create({
                        user_id: reactionMessage.user_id
                    });

                    userInDb2.karma += 1;
                    await userInDb2.save();

                    infoLog("Added a karma to a user", `${__dirname}/${__filename}.js`, "CLIENT-INFO");
                    return;
                }

                // if it isnt null we can just add +1 karma.
                userInDb.karma += 1;
                await userInDb.save();

                infoLog("Added a karma to a user", `${__dirname}/${__filename}.js`, "CLIENT-INFO");
                return;
            }

            else if (messageReaction.emoji.name === "🟥") {
                const userInDb = await UserKarma.findOne({
                    where: {
                        user_id: reactionMessage.user_id
                    }
                }) || null;

                if (userInDb === null) {
                    const userInDb2 = await UserKarma.create({
                        user_id: reactionMessage.user_id
                    });

                    userInDb2.karma -= 1;
                    await userInDb2.save();

                    infoLog("Removed karma from a user", `${__dirname}/${__filename}.js`, "CLIENT-INFO");

                    return;
                }

                // if it isnt null we can just removed 1 karma.
                userInDb.karma -= 1;
                await userInDb.save();
                
                infoLog("Removed karma from a user", `${__dirname}/${__filename}.js`, "CLIENT-INFO");
                return;
            }

            else {
                return;
            }
        }); 

        // when someone removes a reaction from a suggestion message
        client.on("messageReactionRemove", async (messageReaction) => {
            const reactionMessage = await SuggestionMessages.findOne({
                where: {
                    message_id: messageReaction.message.id
                }
            }) || null;
            
            // this checks for if the message exists in the database.
            if (reactionMessage === null) return;

            // this checks for the age of the suggestion, if its more than a week old, delete the message from the database.
            // this removed unnecessary clutter, helps reduce disk usage, makes things a bit faster and allows users to receive only a certain amount of karma per suggestion.
            if (reactionMessage.sent_at < Date.now() - 86400000 * 7) {
                reactionMessage.destroy({
                    where: {
                        message_id: messageReaction.message.id
                    }
                }); 

                infoLog("Deleted a database entry", `${__dirname}/${__filename}.js`, "CLIENT-INFO");
            }


            // the next if statements in this indent check for what kind of emoji was reacted with
            // if the emoji is an "upvote" you add 1 karma, and if its a downvote you remove 1 karma, otherwise just return.
            if (messageReaction.emoji.name === "🟩") {
                const userInDb = await UserKarma.findOne({
                    where: {
                        user_id: reactionMessage.user_id
                    }
                }) || null;

                if (userInDb === null) {
                    const userInDb2 = await UserKarma.create({
                        user_id: reactionMessage.user_id
                    });

                    userInDb2.karma -= 1;
                    userInDb2.save();

                    infoLog("Removed karma from a user", `${__dirname}/${__filename}.js`, "CLIENT-INFO");
                    return;
                }

                // if it isnt null we can just add +1 karma.
                userInDb.karma += 1;
                userInDb.save();

                infoLog("Removed karma from a user", `${__dirname}/${__filename}.js`, "CLIENT-INFO");
                return;
            }

            else if (messageReaction.emoji.name === "🟥") {
                const userInDb = await UserKarma.findOne({
                    where: {
                        user_id: reactionMessage.user_id
                    }
                }) || null;

                if (userInDb === null) {
                    const userInDb2 = await UserKarma.create({
                        user_id: reactionMessage.user_id
                    });

                    userInDb2.karma += 1;
                    userInDb2.save();

                    infoLog("Added karma to a user", `${__dirname}/${__filename}.js`, "CLIENT-INFO");

                    return;
                }

                // if it isnt null we can just removed 1 karma.
                userInDb.karma += 1;
                userInDb.save();

                infoLog("Added karma to a user", `${__dirname}/${__filename}.js`, "CLIENT-INFO");
                return;
            }

            else {
                return;
            }
        });
    }
};