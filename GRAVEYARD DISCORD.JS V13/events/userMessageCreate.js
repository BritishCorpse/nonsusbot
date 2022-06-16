const { userCurrency } = require("../db_objects"); 

module.exports = {
    name: "userMessageCreate",
    execute(graveyard) {
        graveyard.on("messageCreate", async message => {
            //! THIS FILE ONLY HANDLES MESSAGES CREATED BY USERS.
            if (message.author.bot) return;

            //
            //! Currency
            //

            //* add one coin to the users balance
            userCurrency.addBalance(message.author.id, 1);
        });
    }
};