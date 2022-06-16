const { userCurrency } = require("../db_objects"); 

module.exports = {
    name: "messageCreate",
    execute(graveyard) {
        graveyard.on("messageCreate", async message => {
            //
            //! Currency
            //

            //* add one coin to the users balance
            userCurrency.addBalance(message.author.id, 1);
        });
    }
};