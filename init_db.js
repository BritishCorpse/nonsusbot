/* eslint-disable no-unused-vars */
const Sequelize = require("sequelize");

const sequelize = new Sequelize("currency_database", "username", "password", {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: "database.sqlite",
});

const {
    browncat,
    blackcat,
    bible,
    chicken,
    chickennugget,
    coke,
    cross,
    denmark,
    developer,
    estonia,
    eu,
    finland,
    france,
    gembadge,
    gembadgedarkgreen,
    gembadgegray,
    gembadgegreen,
    gembadgelavender,
    gembadgered,
    gembadgeblue,
    goldencross,
    gravestone,
    graycat,
    greenstepcut,
    heart1,
    japan,
    longarms,
    norway,
    orangecat,
    qatar,
    redstepcut,
    speckycat,
    suscat,
    sweden,
    switzerland,
    tomato,
    water,
    whitecat,
} = require("./emojis.json");




const CurrencyShop = require("./models/CurrencyShop")(sequelize, Sequelize.DataTypes);
require("./models/Users")(sequelize, Sequelize.DataTypes);
require("./models/UserItems")(sequelize, Sequelize.DataTypes);
const Stocks = require("./models/Stocks")(sequelize, Sequelize.DataTypes);
require("./models/UserPortfolio")(sequelize, Sequelize.DataTypes);
require("./models/Levels")(sequelize, Sequelize.DataTypes);
require("./models/Counting")(sequelize, Sequelize.DataTypes);

require("./models/SelfRoleChannels")(sequelize, Sequelize.DataTypes);
require("./models/SelfRoleMessages")(sequelize, Sequelize.DataTypes);
require("./models/SelfRoleCategories")(sequelize, Sequelize.DataTypes);
require("./models/SelfRoleRoles")(sequelize, Sequelize.DataTypes);

require("./models/AutoRoleRoles")(sequelize, Sequelize.DataTypes);

require("./models/VerifyQuestions")(sequelize, Sequelize.DataTypes);
require("./models/VerifyMessages")(sequelize, Sequelize.DataTypes);
require("./models/VerifyChannels")(sequelize, Sequelize.DataTypes);
require("./models/VerifyRoles")(sequelize, Sequelize.DataTypes);

require("./models/UserKarma")(sequelize, Sequelize.DataTypes);
require("./models/SuggestionMessages")(sequelize, Sequelize.DataTypes);

require("./models/UserWarns")(sequelize, Sequelize.DataTypes);
require("./models/GuildWarns")(sequelize, Sequelize.DataTypes);

require("./models/UserProfiles")(sequelize, Sequelize.DataTypes);

require("./models/GoodBot")(sequelize, Sequelize.DataTypes);
const FightMoves = require("./models/FightMoves")(sequelize, Sequelize.DataTypes);

const force = process.argv.includes("--force") || process.argv.includes("-f");


// Here I present, organised spaghetti code, this is just a base format for the tables to makes sure that everything exists.
sequelize.sync({ force }).then(async () => {
    const moves = [
        FightMoves.upsert({ name: "Punch", cost: 1, power: 1 }),
        FightMoves.upsert({ name: "Kick", cost: 2, power: 3 }),
        FightMoves.upsert({ name: "Bite", cost: 4, power: 4 }),
        FightMoves.upsert({ name: "Stab", cost: 10, power: 9 }),
        FightMoves.upsert({ name: "Swing bag", cost: 2, power: 3 }),
        FightMoves.upsert({ name: "Brick throw", cost: 3, power: 2 }),
        FightMoves.upsert({ name: "Complain loudly", cost: 1, power: 1 }),
        FightMoves.upsert({ name: "Misunderstand technology", cost: 3, power: 4 }),
        FightMoves.upsert({ name: "Poop", cost: 12, power: 17 }),   
        FightMoves.upsert({ name: "Summon Cthulhu", cost: 50, power: 80})
    ];

    const stocks = [
        Stocks.upsert({ id: 1000, name: "GC", oldPrice: "2287135438", currentPrice: "2287135438", averageChange: "1", lastUpdated: "0", displayName: "Graveyard Casino", amountBought: 0}),
        Stocks.upsert({ id: 1001, name: "PAS", oldPrice: "0", currentPrice: "1000", averageChange: "0.5", lastUpdated: "0", displayName: "Pets And Stuff", amountBought: 0}),
        Stocks.upsert({ id: 1002, name: "AWS", oldPrice: "0", currentPrice: "33333", averageChange: "5", lastUpdated: "0", displayName: "Amazing", amountBought: 0}),
        Stocks.upsert({ id: 1003, name: "GS", oldPrice: "0", currentPrice: "1007", averageChange: "3", lastUpdated: "0", displayName: "GameStep", amountBought: 0}),
        Stocks.upsert({ id: 1004, name: "GRND", oldPrice: "0", currentPrice: "900", averageChange: "0.3", lastUpdated: "0", displayName: "Grandma's Cookie Factory", amountBought: 0}),
        Stocks.upsert({ id: 1005, name: "NVD", oldPrice: "0", currentPrice: "2349", averageChange: "10", lastUpdated: "0", displayName: "Nvooders", amountBought: 0}),
        Stocks.upsert({ id: 1006, name: "DNF", oldPrice: "0", currentPrice: "1000000", averageChange: "2", lastUpdated: "0", displayName: "Danish Films", amountBought: 0}),
        Stocks.upsert({ id: 1007, name: "EE", oldPrice: "0", currentPrice: "4000", averageChange: "4", lastUpdated: "0", displayName: "Egirl Empire", amountBought: 0}),
        Stocks.upsert({ id: 1008, name: "TWC", oldPrice: "0", currentPrice: "345", averageChange: "10", lastUpdated: "0", displayName: "Twootch", amountBought: 0}),
        Stocks.upsert({ id: 1009, name: "KMBP", oldPrice: "0", currentPrice: "3000000", averageChange: "1", lastUpdated: "0", displayName: "Kim & Bap", amountBought: 0}),
        Stocks.upsert({ id: 10010, name: "SAS", oldPrice: "0", currentPrice: "10653", averageChange: "2", lastUpdated: "0", displayName: "Sheep & Shite", amountBought: 0}),
        Stocks.upsert({ id: 10011, name: "SB", oldPrice: "0", currentPrice: "1534", averageChange: "1", lastUpdated: "0", displayName: "Soduko Bros", amountBought: 0}),
        Stocks.upsert({ id: 10012, name: "MS", oldPrice: "0", currentPrice: "1476543", averageChange: "0.5", lastUpdated: "0", displayName: "Megasoft", amountBought: 0}),
        Stocks.upsert({ id: 10013, name: "PR", oldPrice: "0", currentPrice: "1126894", averageChange: "0.5", lastUpdated: "0", displayName: "Pear", amountBought: 0}),
        Stocks.upsert({ id: 10014, name: "NTA", oldPrice: "0", currentPrice: "573849", averageChange: "1", lastUpdated: "0", displayName: "Nature Association", amountBought: 0}),
        Stocks.upsert({ id: 10015, name: "DISC", oldPrice: "0", currentPrice: "573242", averageChange: "1", lastUpdated: "0", displayName: "Disc-Org", amountBought: 0}),
        Stocks.upsert({ id: 10016, name: "PHLS", oldPrice: "0", currentPrice: "750439", averageChange: "3", lastUpdated: "0", displayName: "Phils", amountBought: 0}),
        Stocks.upsert({ id: 10017, name: "MRSP", oldPrice: "0", currentPrice: "12535", averageChange: "0.9", lastUpdated: "0", displayName: "Mrs Prongs", amountBought: 0}),
        Stocks.upsert({ id: 10018, name: "WWW", oldPrice: "0", currentPrice: "1235426548", averageChange: "0.5", lastUpdated: "0", displayName: "Wizard's and Witches' Wands", amountBought: 0}),
        Stocks.upsert({ id: 10019, name: "BGEL", oldPrice: "0", currentPrice: "16254262520", averageChange: "1", lastUpdated: "0", displayName: "Big Evil", amountBought: 0}),
        Stocks.upsert({ id: 10020, name: "GGS", oldPrice: "0", currentPrice: "100245787865", averageChange: "0.3", lastUpdated: "0", displayName: "Girthy Gems", amountBought: 0}),
        Stocks.upsert({ id: 10021, name: "SM", oldPrice: "0", currentPrice: "1573829", averageChange: "2", lastUpdated: "0", displayName: "Silky Milk", amountBought: 0}),
        Stocks.upsert({ id: 10022, name: "ASS", oldPrice: "0", currentPrice: "100583953", averageChange: "4", lastUpdated: "0", displayName: "Arson Assassins", amountBought: 0}),
        Stocks.upsert({ id: 10023, name: "CP", oldPrice: "0", currentPrice: "303869", averageChange: "1", lastUpdated: "0", displayName: "Corn Palace", amountBought: 0}),
        Stocks.upsert({ id: 10024, name: "RX", oldPrice: "0", currentPrice: "1859392", averageChange: "1", lastUpdated: "0", displayName: "Rotex", amountBought: 0}),
        Stocks.upsert({ id: 10025, name: "GM", oldPrice: "0", currentPrice: "15938492", averageChange: "0.5", lastUpdated: "0", displayName: "Graveyard Market", amountBought: 0}),
        Stocks.upsert({ id: 10026, name: "THD", oldPrice: "0", currentPrice: "30583", averageChange: "0.8", lastUpdated: "0", displayName: "THE Dentist", amountBought: 0}),
        Stocks.upsert({ id: 10027, name: "KBS", oldPrice: "0", currentPrice: "45938", averageChange: "1", lastUpdated: "0", displayName: "Keem Switches Corp", amountBought: 0}),
        Stocks.upsert({ id: 10028, name: "KBC", oldPrice: "0", currentPrice: "25948", averageChange: "1", lastUpdated: "0", displayName: "Keep Caps Corp", amountBought: 0}),
        Stocks.upsert({ id: 10029, name: "PPGB", oldPrice: "0", currentPrice: "750398", averageChange: "2", lastUpdated: "0", displayName: "Propaganda Bros", amountBought: 0}),
        Stocks.upsert({ id: 10030, name: "BNB", oldPrice: "0", currentPrice: "60093", averageChange: "4", lastUpdted: "0", displayName: "Beet & Beef", amountBought: 0}),
        Stocks.upsert({ id: 10031, name: "LTW", oldPrice: "0", currentPrice: "89232", averageChange: "2", lastUpdated: "0", displayName: "Light The World", amountBought: 0}),
        Stocks.upsert({ id: 10032, name: "GWSC", oldPrice: "0", currentPrice: "9524", averageChange: "0", lastUpdated: "0", displayName: "Glowsticks Corp", amountBought: 0}),
        Stocks.upsert({ id: 10033, name: "TGD", oldPrice: "0", currentPrice: "1573985323", averageChange: "10", lastUpdated: "0", displayName: "The Gamblers Dream", amountBought: 0}),        
    ];

    const shop = [ 
        CurrencyShop.upsert({ id: 1000 ,  itemEmoji: gembadge, name: "Gem Badge", cost: 1000000, itemDescription: "Ooh shiny!", category: "Badges"}),
        CurrencyShop.upsert({ id: 1001 ,  itemEmoji: gembadge, name: "Diamond Badge", cost: 100000, itemDescription: "Ooh shiny!", category: "Badges"}),
        CurrencyShop.upsert({ id: 1002 ,  itemEmoji: gembadgegreen, name: "Emeral Badge", cost: 100000, itemDescription: "Ooh shiny!", category: "Badges"}),
        CurrencyShop.upsert({ id: 1003 ,  itemEmoji: gembadgegreen, name: "Golden Badge", cost: 200000, itemDescription: "golden like your heart :heart_eyes:", category: "Badges"}),
        CurrencyShop.upsert({ id: 1004 ,  itemEmoji: gembadgelavender, name: "Amethyst Badge", cost: 9999999, itemDescription: "by the 1% for the 1%", category: "Badges"}),
        CurrencyShop.upsert({ id: 1005 ,  itemEmoji: gembadgelavender, name: "Pink Badge", cost: 1000000, itemDescription: "by the 0.1% for the 0.1%", category: "Badges"}),
        CurrencyShop.upsert({ id: 1006 ,  itemEmoji: null, name: "China Badge", itemDescription: "for taiwan!", cost: 100000, category: "Badges"}),
        CurrencyShop.upsert({ id: 1007 ,  itemEmoji: estonia, name: "Estonia Badge", itemDescription: "finland's little sister", cost: 100000, category: "Badges"}),  
        CurrencyShop.upsert({ id: 1008 ,  itemEmoji: denmark, name: "Denmark Badge", itemDescription: "Nice kingdom!", cost: 100000, category: "Badges"}),
        CurrencyShop.upsert({ id: 1009 ,  itemEmoji: eu, name: "Eu Badge", cost: 10000, itemDescription: "A *country*.", category: "Badges"}),
        CurrencyShop.upsert({ id: 1010 ,  itemEmoji: finland, name: "Finland Badge", itemDescription: "Land of the 200 thousand lakes!", cost: 10000, category: "Badges"}),
        CurrencyShop.upsert({ id: 1011 ,  itemEmoji: null, name: "Indonesia Badge", itemDescription: "The rulers of Growtopia", cost: 10000, category: "Badges"}),
        CurrencyShop.upsert({ id: 1012 ,  itemEmoji: japan, name: "Japan Badge", itemDescription: "mm waifus.", cost: 10000, category: "Badges"}),
        CurrencyShop.upsert({ id: 1013 ,  itemEmoji: norway, name: "Norway Badge", itemDescription: "OIL FOR DAYS!", cost: 10000, category: "Badges"}),
        CurrencyShop.upsert({ id: 1014 ,  itemEmoji: null, name: "Poland Badge", itemDescription: "Polske! Or something like that.", cost: 10000, category: "Badges"}),
        CurrencyShop.upsert({ id: 1015 ,  itemEmoji: qatar, name: "Qatar Badge", itemDescription: "saaaaaaaaaaaaaaaaaaaaaaaaannnnnnnnnnnnnnnd", cost: 10000, category: "Badges"}),
        CurrencyShop.upsert({ id: 1016 ,  itemEmoji: null, name: "Russia Badge", itemDescription: "insert Vodka or Adidas joke.", cost: 10000, category: "Badges"}),
        CurrencyShop.upsert({ id: 1017 ,  itemEmoji: sweden, name: "Sweden Badge", itemDescription: "certified bad ice hockey players", cost: 10000, category: "Badges"}),
        CurrencyShop.upsert({ id: 1018 ,  itemEmoji: switzerland, name: "Switzerland Badge", itemDescription: "Fondue :heart_eyes:", cost: 10000, category: "Badges"}),
        CurrencyShop.upsert({ id: 1019 ,  itemEmoji: null, name: "Usa Badge", itemDescription: "Steal their land and call it our own!", cost: 10000, category: "Badges"}),
        CurrencyShop.upsert({ id: 1020 ,  itemEmoji: null, name: "Graveyard Shield", itemDescription: "Rep the Graveyard Badge, now in a fashionable purple!", cost: 10000, category: "Badges"}),
        CurrencyShop.upsert({ id: 1021 ,  itemEmoji: null, name: "Pride Badge", itemDescription: "Steal the rainbow!!", cost: 10000, category: "Badges"}),
        CurrencyShop.upsert({ id: 1022 ,  itemEmoji: null, name: "Golden Shield", itemDescription: "Protect yourself from incels!", cost: 10000, category: "Badges"}),
        CurrencyShop.upsert({ id: 1023 ,  itemEmoji: null, name: "Royal Badge", itemDescription: "Join the royalty! For a high price of course.", cost: 10000000, category: "Badges"}),  

        CurrencyShop.upsert({ id: 1025 ,  itemEmoji: null, name: "Casino Membership", cost: 1000, itemDescription: "Join the casino for some exquisite gambling!", category: "Special"}),

        //Fiction
        CurrencyShop.upsert({ id: 1026 ,  itemEmoji: bible, name: "Bible", cost: 20, itemDescription: "read the finest work of fiction ever to be created", category: "Fiction"}),
        CurrencyShop.upsert({ id: 1027 ,  itemEmoji: null, name: "Biblically Accurate Angel", cost: 5000000, itemDescription: "spoookyy", category: "Fiction"}),
        CurrencyShop.upsert({ id: 1028 ,  itemEmoji: null, name: "Angel", cost: 777, itemDescription: "drippy wings🥶", category: "Fiction"}),
        CurrencyShop.upsert({ id: 1029 ,  itemEmoji: null, name: "Demon", cost: 6666, itemDescription: "premium collectible", category: "Fiction"}),
        CurrencyShop.upsert({ id: 1030 ,  itemEmoji: null, name: "Evil Soul", cost: 10000, itemDescription: "For those on the wrong side of history.", category: "Fiction"}),
        CurrencyShop.upsert({ id: 1031 ,  itemEmoji: goldencross, name: "Catholic cross", cost: 40, itemDescription: "religin", category: "Fiction"}),


        //Flowers
        CurrencyShop.upsert({ id: 1032 ,  itemEmoji: null, name: "Rose", cost: 2, itemDescription: "smells like a tardis!", category: "Flowers"}),
        CurrencyShop.upsert({ id: 1033 ,  itemEmoji: null, name: "Sunflower", cost: 3, itemDescription: "follow the rising sun!", category: "Flowers"}),

        //Memes
        CurrencyShop.upsert({ id: 1034 ,  itemEmoji: water, name: "One third of an amazon stock", cost: 1125, itemDescription: "close enough to the real price", category: "Memes"}),
        CurrencyShop.upsert({ id: 1035 ,  itemEmoji: null, name: "Water", cost: 1, itemDescription: "r/hydrohomies", category: "Memes"}),
        CurrencyShop.upsert({ id: 1036 ,  itemEmoji: chickennugget, name: "Tendies", cost: 5000, itemDescription: "r/superstonk!!!1!!!!11!!!", category: "Memes"}),
        CurrencyShop.upsert({ id: 1037 ,  itemEmoji: null, name: "Typical Femoid", cost: 1000, itemDescription: "shoutout 4chan", category: "Memes"}),

        //Dogs
        CurrencyShop.upsert({ id: 1048 ,  itemEmoji: null, name: "Dog #939458315", cost: 100, itemDescription: "How does this exist?", category: "Dogs"}),
        CurrencyShop.upsert({ id: 1049 ,  itemEmoji: null, name: "German Shepherd", cost: 500, itemDescription: "Tried and true classic1", category: "Dogs"}),
        CurrencyShop.upsert({ id: 1050 ,  itemEmoji: null, name: "Labrador", cost: 354, itemDescription: "Labradori!", category: "Dogs"}),
        CurrencyShop.upsert({ id: 1051 ,  itemEmoji: null, name: "Pomeranian", cost: 700, itemDescription: "Some people argue that pomeranians don't have a body, only fluff.", category: "Dogs"}),
        CurrencyShop.upsert({ id: 1052 ,  itemEmoji: null, name: "Poodle", cost: 1000, itemDescription: "Did the queen have these?", category: "Dogs"}),
        CurrencyShop.upsert({ id: 1053 ,  itemEmoji: null, name: "Shiba", cost: 1200, itemDescription: "A favourite of mine!", category: "Dogs"}),
        CurrencyShop.upsert({ id: 1054 ,  itemEmoji: null, name: "Bella Dog", cost: 1500, itemDescription: "A vaccuum cleaner of sorts.", category: "Dogs"}),
        CurrencyShop.upsert({ id: 1055 ,  itemEmoji: null, name: "Chloe Dog", cost: 10000, itemDescription: "A rat in disguise.", category: "Dogs"}),
        CurrencyShop.upsert({ id: 1056 ,  itemEmoji: null, name: "Dachshund", cost: 1201, itemDescription: "Hey d!", category: "Dogs"}),
        
        //Cats
        CurrencyShop.upsert({ id: 1057 ,  itemEmoji: suscat, name: "No colour cat", cost: 10, itemDescription: "Seriously, how do you exist?? Freak of nature.", category: "Cats"}),
        CurrencyShop.upsert({ id: 1058 ,  itemEmoji: blackcat, name: "Black Cat", cost: 100, itemDescription: "Good luck inbouundd!!!", category: "Cats"}),
        CurrencyShop.upsert({ id: 1059 ,  itemEmoji: orangecat, name: "Orange Cat", cost: 200, itemDescription: "Orngeag", category: "Cats"}),
        CurrencyShop.upsert({ id: 1060 ,  itemEmoji: graycat, name: "Gray Cat", cost: 150, itemDescription: "Cute kitty!", category: "Cats"}),
        CurrencyShop.upsert({ id: 1061 ,  itemEmoji: whitecat, name: "White Cat", cost: 200, itemDescription: "Cute kitty, but white!", category: "Cats"}),
        CurrencyShop.upsert({ id: 1062 ,  itemEmoji: browncat, name: "Brown Cat", cost: 160, itemDescription: "Smells like coffee beans.", category: "Cats"}),
        CurrencyShop.upsert({ id: 1064 ,  itemEmoji: browncat, name: "Manta Cat", cost: 10000, itemDescription: "The developer's cat is here?!! Hey cutie! (ig:photosfromthenordic)", category: "Cats"}),
        CurrencyShop.upsert({ id: 1065 ,  itemEmoji: speckycat, name: "Callie Cat", cost: 10000, itemDescription: "Watching over the server administrators.", category: "Cats"}),

        //Fish
        CurrencyShop.upsert({ id: 1066  ,  itemEmoji: null, name: "Fish Ziggy", cost: 1000, itemDescription: "\"He's a bit fat, but it's okay he's cute.\"", category: "Fish"}),

        //Food
        CurrencyShop.upsert({ id: 1067 ,  itemEmoji: null, name: "Cookie", cost: 1, itemDescription: "take one, but only one.", category: "Food"}),
        CurrencyShop.upsert({ id: 1068 ,  itemEmoji: chicken, name: "Chicken", cost: 748485395, itemDescription: "chocken", category: "Food"}),
        CurrencyShop.upsert({ id: 1069 ,  itemEmoji: null, name: "Doritoes", cost: 7000, itemDescription: "Man we really are evading lawsuits faster than politicians avoid questions.", category: "Food"}),
        CurrencyShop.upsert({ id: 1070 ,  itemEmoji: null, name: "Japenese food", cost: 10, itemDescription: "\"You can never go wrong with chinese food! Oh wait.\"", category: "Food"}),
        CurrencyShop.upsert({ id: 1071 ,  itemEmoji: null, name: "1.5 chicken nuggets", cost: 5, itemDescription: "CHICKEN NUGGIES", category: "Food"}),
        CurrencyShop.upsert({ id: 1072 ,  itemEmoji: null, name: "Premium Cookie", cost: 100, itemDescription: "What even is this?", category: "Food" }),
        CurrencyShop.upsert({ id: 1073 ,  itemEmoji: null, name: "Coke E Cola", cost: 3, itemDescription: "Don't want a lawsuit after all ;)", category: "Food" }),
        CurrencyShop.upsert({ id: 1075 ,  itemEmoji: null, name: "Father's spaghetti", cost: 243, itemDescription: "For when you don't have a mom to cook for you.", category: "Food"}),
        CurrencyShop.upsert({ id: 1076 ,  itemEmoji: null, name: "Fish eggs", cost: 100, itemDescription: "YUM!", category: "Food", affectedBy: "KMBP", affectPercent: "1"}),

        //Other
        CurrencyShop.upsert({ id: 1077 ,  itemEmoji: null, name: "Fresh car smell in a bottle", cost: 40, itemDescription: "SO REFRESHING😍", category: "Weird Things"}),
        CurrencyShop.upsert({ id: 1078 ,  itemEmoji: null, name: "Wooden plank", cost: 20, itemDescription: "craft some bitches :skull:", category: "Wooden"}),

        //ranks
        CurrencyShop.upsert({ id: 1079,  itemEmoji: null, name: "VIP", cost: 10000000, itemDescription: "not that impressive..", category: "Rank"}),
        CurrencyShop.upsert({ id: 1080, itemEmoji: null, name: "PREMIUM", cost: 100000000, itemDescription: "actually a little bit impressive.", rank: "Rank"}),
        CurrencyShop.upsert({ id: 1081, itemEmoji: null, name: "UNDEFEATED", cost: 8008135420, itemDescription: "SHEEESH", category: "Rank"})
    ];

    await Promise.all(stocks);
    console.log("Stocks database synced.");
    await Promise.all(shop);
    console.log("Currency database synced.");
    await Promise.all(moves);
    console.log("Fight moves updated.");

    sequelize.close();
}).catch(console.error);
