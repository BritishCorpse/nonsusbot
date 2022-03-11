const Sequelize = require("sequelize");

const sequelize = new Sequelize("currency_database", "username", "password", {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: "database.sqlite",
});

const CurrencyShop = require("./models/CurrencyShop")(sequelize, Sequelize.DataTypes);
require("./models/Users")(sequelize, Sequelize.DataTypes);
require("./models/UserItems")(sequelize, Sequelize.DataTypes);
const Stocks = require("./models/Stocks")(sequelize, Sequelize.DataTypes);
require("./models/UserPortfolio")(sequelize, Sequelize.DataTypes);
require("./models/Levels")(sequelize, Sequelize.DataTypes);
require("./models/Counting")(sequelize, Sequelize.DataTypes);

const force = process.argv.includes("--force") || process.argv.includes("-f");


// Here I present, organised spaghetti code, this is just a base format for the tables to makes sure that everything exists.
sequelize.sync({ force }).then(async () => {
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
        CurrencyShop.upsert({ id: 1004 ,  itemEmoji: "<:gembadge:926886708497248416>", name: "Gem Badge", cost: 1000000, itemDescription: "Ooh shiny!", category: "Badges"}),
        CurrencyShop.upsert({ id: 1028 ,  itemEmoji: "<:bluebadge:926888981306691634>", name: "Diamond Badge", cost: 1000000, itemDescription: "Ooh shiny!", category: "Badges"}),
        CurrencyShop.upsert({ id: 1032 ,  itemEmoji: "<:emeraldbadge:926889164635516938>", name: "Emeral Badge", cost: 1000000, itemDescription: "Ooh shiny!", category: "Badges"}),
        CurrencyShop.upsert({ id: 1039 ,  itemEmoji: "<:goldbadge:926889021525864458>", name: "Golden Badge", cost: 20000000, itemDescription: "Join the 20 Million Club!", category: "Badges"}),
        CurrencyShop.upsert({ id: 1052 ,  itemEmoji: "<:amethystbadge:926889002290794578>", name: "Amethyst Badge", cost: 999999999, itemDescription: "Obtainable only, by the 1%.", category: "Badges"}),
        CurrencyShop.upsert({ id: 1063 ,  itemEmoji: "<:pinkbadge:926889010842980402>", name: "Pink Badge", cost: 1000000000, itemDescription: "A badge for true billionaires.", category: "Badges"}),
        CurrencyShop.upsert({ id: 1064 ,  itemEmoji: "<:flagch:929750660432416768>", name: "China Badge", itemDescription: "GLORY TO THE CCP!", cost: 100000, category: "Badges"}),
        CurrencyShop.upsert({ id: 4426 ,  itemEmoji: "<:estonia:933744210530689114>", name: "Estonia Badge", itemDescription: "mm finland part 2", cost: 100000, category: "Badges"}),  
        CurrencyShop.upsert({ id: 7655 ,  itemEmoji: "<:flagde:929750687926091806>", name: "Denmark Badge", itemDescription: "Nice kingdom!", cost: 100000, category: "Badges"}),
        CurrencyShop.upsert({ id: 4861 ,  itemEmoji: "<:eu:933744210639736872>", name: "Eu Badge", cost: 100000, itemDescription: "A *country*.", category: "Badges"}),
        CurrencyShop.upsert({ id: 6990 ,  itemEmoji: "<:finland:933744210581008454>", name: "Finland Badge", itemDescription: "Land of the 200 thousand lakes!", cost: 100000, category: "Badges"}),
        CurrencyShop.upsert({ id: 8324 ,  itemEmoji: "<:flagin:929750649481101385>", name: "Indonesia Badge", itemDescription: "The rulers of Growtopia", cost: 100000, category: "Badges"}),
        CurrencyShop.upsert({ id: 2689 ,  itemEmoji: "<:japan:933744210610356366>", name: "Japan Badge", itemDescription: "mm waifus.", cost: 100000, category: "Badges"}),
        CurrencyShop.upsert({ id: 6925 ,  itemEmoji: "<:norway:933744210220298291>", name: "Norway Badge", itemDescription: "OIL FOR DAYS!", cost: 100000, category: "Badges"}),
        CurrencyShop.upsert({ id: 3526 ,  itemEmoji: "<:flagpo:929750688009949184>", name: "Poland Badge", itemDescription: "Polske! Or something like that.", cost: 100000, category: "Badges"}),
        CurrencyShop.upsert({ id: 4249 ,  itemEmoji: "<:qatar:933744210593599578>", name: "Qatar Badge", itemDescription: "Snad.", cost: 100000, category: "Badges"}),
        CurrencyShop.upsert({ id: 5717 ,  itemEmoji: "<:flagru:929750688110624879>", name: "Russia Badge", itemDescription: "Insert Vodka or Adidas joke.", cost: 100000, category: "Badges"}),
        CurrencyShop.upsert({ id: 9856 ,  itemEmoji: "<:sweden:933744210404851776>", name: "Sweden Badge", itemDescription: "Bad at hockey.", cost: 100000, category: "Badges"}),
        CurrencyShop.upsert({ id: 8636 ,  itemEmoji: "<:switzerland:933744210614550589>", name: "Switzerland Badge", itemDescription: "Fondue :heart_eyes:", cost: 100000, category: "Badges"}),
        CurrencyShop.upsert({ id: 4144 ,  itemEmoji: "<:flagus:929750687934480394>", name: "Usa Badge", itemDescription: "Steal their land and call it our own!", cost: 100000, category: "Badges"}),
        CurrencyShop.upsert({ id: 8500 ,  itemEmoji: "<:graveyardshield:929743719656226837>", name: "Graveyard Shield", itemDescription: "Rep the Graveyard Badge, now in a fashionable purple!", cost: 100000, category: "Badges"}),
        CurrencyShop.upsert({ id: 7289 ,  itemEmoji: "<:prideshield:929743754829656138>", name: "Pride Badge", itemDescription: "Steal the rainbow!!", cost: 100000, category: "Badges"}),
        CurrencyShop.upsert({ id: 6080 ,  itemEmoji: "<:goldenshield:929759898944819250>", name: "Golden Shield", itemDescription: "Protect yourself from incels!", cost: 100000, category: "Badges"}),
        CurrencyShop.upsert({ id: 6617 ,  itemEmoji: "<:royalbadge:933466266352644149>", name: "Royal Badge", itemDescription: "Join the royalty! For a high price of course.", cost: 10000000000, category: "Badges"}),  

        //Special
        CurrencyShop.upsert({ id: 7757 ,  itemEmoji: "<:vipbadge:931917580103450635>", name: "VIP pass", cost: 10000000, itemDescription: "Flex on your friends!", category: "Special"}),
        CurrencyShop.upsert({ id: 7105 ,  itemEmoji: "<:certificate:926539198503211051>", name: "Casino Membership", cost: 1000, itemDescription: "Join the casino for some exquisite gambling!", category: "Special"}),

        //Fiction
        CurrencyShop.upsert({ id: 8779 ,  itemEmoji: "<:book1:933470576440406166>", name: "Bible", cost: 20, itemDescription: "Read up on some of history's best works of fiction!", category: "Fiction"}),
        CurrencyShop.upsert({ id: 4703 ,  itemEmoji: "<:book1:933470576440406166>", name: "Biblically Accurate Angel", cost: 5000000, itemDescription: "They must've escaped! How did that even happen it's an entry in a database!", category: "Fiction"}),
        CurrencyShop.upsert({ id: 1447 ,  itemEmoji: "<:book1:933470576440406166>", name: "Angel", cost: 777, itemDescription: "Looks like this ones a tad more child friendly.", category: "Fiction"}),
        CurrencyShop.upsert({ id: 7882 ,  itemEmoji: ":smiling_imp:", name: "Demon", cost: 6666, itemDescription: "Collect these and see how many you can get!", category: "Fiction"}),
        CurrencyShop.upsert({ id: 8802 ,  itemEmoji: "<:evilsoul:929752927789260830>", name: "Evil Soul", cost: 10000, itemDescription: "For those on the wrong side of history.", category: "Fiction"}),
        CurrencyShop.upsert({ id: 6616 ,  itemEmoji: "<:cross:933697557396332564>", name: "Catholic cross", cost: 40, itemDescription: "religin", category: "Fiction"}),


        //Flowers
        CurrencyShop.upsert({ id: 2512 ,  itemEmoji: ":rose:", name: "Rose", cost: 2, itemDescription: "It smells delightful!", category: "Flowers"}),
        CurrencyShop.upsert({ id: 1032 ,  itemEmoji: "🌻", name: "Sunflower", cost: 3, itemDescription: "It smells slightly less delightful than a rose, but still alright.", category: "Flowers"}),

        //Memes
        CurrencyShop.upsert({ id: 6032 ,  itemEmoji: ":top:", name: "One third of an amazon stock", cost: 1125, itemDescription: "Genuine price of one third of an Amazon stock.", category: "Memes"}),
        CurrencyShop.upsert({ id: 1025 ,  itemEmoji: "<:water:933693983354408991>", name: "Water", cost: 1, itemDescription: "r/hydrohomies", category: "Memes"}),
        CurrencyShop.upsert({ id: 6505 ,  itemEmoji: "<:chickennugget:933693369757106246>", name: "Tendies", cost: 5000, itemDescription: "r/superstonk!!!1!!!!11!!!", category: "Memes"}),
        CurrencyShop.upsert({ id: 7441 ,  itemEmoji: "<:heart1:933467721079857184>", name: "Typical Femoid", cost: 1000, itemDescription: "They always chase after chads when there's a nice guy like me right here!", category: "Memes"}),

        // People
        CurrencyShop.upsert({ id: 9520 ,  itemEmoji: "<:creditcard2:929759850982953041>", name: "Kanye West", cost: 6600000000, itemDescription: "Nothing special.", category: "People"}),
        CurrencyShop.upsert({ id: 7287 ,  itemEmoji: "<:creditcard2:929759850982953041>", name: "Ryan Reynolds", cost: 150000000, itemDescription: "A fine addition to your collection!", category: "People"}),
        CurrencyShop.upsert({ id: 1185 ,  itemEmoji: "<:longarms:933455888046493746>", name: "Longarms", cost: 100000, itemDescription: "Created in the darkest pits of hell.", category: "People"}),

        /* eslint-disable-next-line no-loss-of-precision */
        CurrencyShop.upsert({ id: 8638 ,  itemEmoji: "<:creditcard2:929759850982953041>", name: "The Dev Team", cost: 999999999999999999999, itemDescription: "Good luck buying this!! Best regards: The Dev Team.", category: "People"}),
        CurrencyShop.upsert({ id: 5179 ,  itemEmoji: "<:locboi:926528670938578945>", name: "LocBoi", cost: 50000000, itemDescription: "He won! Fair and square.", category: "People"}),
        CurrencyShop.upsert({ id: 8900 ,  itemEmoji: "🎤", name: "That one artist who fell off", cost: 2000000, itemDescription: "We all know at least one!", category: "People"}),
        CurrencyShop.upsert({ id: 4026 ,  itemEmoji: "<:goldencross:929750585345966111>", name: "\"God\"", cost: 9223372036854775800, itemDescription: "Just about as much money you can have.", category: "Fiction"}),
        CurrencyShop.upsert({ id: 6149 ,  itemEmoji: "<:creditcard2:929759850982953041>", name: "David Tennant", cost: 17043809, itemDescription: "He really is a lovely man.", category: "People"}),
        CurrencyShop.upsert({ id: 2280 ,  itemEmoji: "🦵", name: "Joe Biden's leg", cost: 2943529411764, itemDescription: "How did they get to that? (1 leg = (Average male's leg weight/Joe biden weight) * U.S.A military networth.)", category: "People"}),
        CurrencyShop.upsert({ id: 8287 ,  itemEmoji: "<:brokenheart:929743654556422195>", name: "Egirl", cost: 10, itemDescription: "\"Why isn't it free?\"", category: "People"}),

        //Dogs
        CurrencyShop.upsert({ id: 2241 ,  itemEmoji: ":one:", name: "Dog #939458315", cost: 100, itemDescription: "How does this exist?", category: "Dogs"}),
        CurrencyShop.upsert({ id: 4774 ,  itemEmoji: "<:germanshepherd:926588424851439656>", name: "German Shepherd", cost: 500, itemDescription: "Tried and true classic1", category: "Dogs"}),
        CurrencyShop.upsert({ id: 3653 ,  itemEmoji: "🐶", name: "Labrador", cost: 354, itemDescription: "Labradori!", category: "Dogs"}),
        CurrencyShop.upsert({ id: 4568 ,  itemEmoji: ":white_circle:", name: "Pomeranian", cost: 700, itemDescription: "Some people argue that pomeranians don't have a body, only fluff.", category: "Dogs"}),
        CurrencyShop.upsert({ id: 9639 ,  itemEmoji: "🐩", name: "Poodle", cost: 1000, itemDescription: "Did the queen have these?", category: "Dogs"}),
        CurrencyShop.upsert({ id: 5702 ,  itemEmoji: "<:shiba:926585439391981608>", name: "Shiba", cost: 1200, itemDescription: "A favourite of mine!", category: "Dogs"}),
        CurrencyShop.upsert({ id: 9595 ,  itemEmoji: "<:belladog2:926497352238379110>", name: "Bella Dog", cost: 1500, itemDescription: "A vaccuum cleaner of sorts.", category: "Dogs"}),
        CurrencyShop.upsert({ id: 2614 ,  itemEmoji: "<:heart1:933467721079857184>", name: "Chloe Dog", cost: 10000, itemDescription: "A rat in disguise.", category: "Dogs"}),
        CurrencyShop.upsert({ id: 9264 ,  itemEmoji: "<:dachshung:926592145538818050>", name: "Dachshund", cost: 1201, itemDescription: "Hey d!", category: "Dogs"}),
        
        //Cats
        CurrencyShop.upsert({ id: 6613 ,  itemEmoji: "<:catnocolourbackground:926455472821788672>", name: "No colour cat", cost: 10, itemDescription: "Seriously, how do you exist?? Freak of nature.", category: "Cats"}),
        CurrencyShop.upsert({ id: 1664 ,  itemEmoji: "<:blackcatnobackground:926455428995510282>", name: "Black Cat", cost: 100, itemDescription: "Good luck inbouundd!!!", category: "Cats"}),
        CurrencyShop.upsert({ id: 7092 ,  itemEmoji: "<:orangecatnobackground:926455401921265704>", name: "Orange Cat", cost: 200, itemDescription: "Orngeag", category: "Cats"}),
        CurrencyShop.upsert({ id: 4585 ,  itemEmoji: "<:graycatnobackground:926454324551381022>", name: "Gray Cat", cost: 150, itemDescription: "Cute kitty!", category: "Cats"}),
        CurrencyShop.upsert({ id: 8413 ,  itemEmoji: "<:whitecatnobackground:926455415351439432>", name: "White Cat", cost: 200, itemDescription: "Cute kitty, but white!", category: "Cats"}),
        CurrencyShop.upsert({ id: 2079 ,  itemEmoji: "<:browncatnobackground:926455380194787339>", name: "Brown Cat", cost: 160, itemDescription: "Smells like coffee beans.", category: "Cats"}),
        CurrencyShop.upsert({ id: 3293 ,  itemEmoji: "<:cliffordnobackground:926455391594905650>", name: "Red Cat", cost: 1000, itemDescription: "..Clifford? (I'm sorry)", category: "Cats"}),
        CurrencyShop.upsert({ id: 1526 ,  itemEmoji: "<:browncatnobackground:926455380194787339>", name: "Manta Cat", cost: 10000, itemDescription: "The developer's cat is here?!! Hey cutie! (ig:photosfromthenordic)", category: "Cats"}),
        CurrencyShop.upsert({ id: 8648 ,  itemEmoji: "<:ramezcat:926508561389993994>", name: "Callie Cat", cost: 10000, itemDescription: "Watching over the server administrators.", category: "Cats"}),

        //Fish
        CurrencyShop.upsert({ id: 2144  ,  itemEmoji: "🐠", name: "Fish Ziggy", cost: 1000, itemDescription: "\"He's a bit fat, but it's okay he's cute.\"", category: "Fish"}),

        //Food
        CurrencyShop.upsert({ id: 6340 ,  itemEmoji: "🍪", name: "Cookie", cost: 1, itemDescription: "You can have one, but only one. I'm always looking at the cookie jar.", category: "Food"}),
        CurrencyShop.upsert({ id: 6273 ,  itemEmoji: "🐤", name: "Chicken", cost: 748485395, itemDescription: "Where's it from?", category: "Food"}),
        CurrencyShop.upsert({ id: 6257 ,  itemEmoji: ":small_red_triangle_down:", name: "Doritoes", cost: 7000, itemDescription: "Man we really are evading lawsuits faster than politicians avoid questions.", category: "Food"}),
        CurrencyShop.upsert({ id: 8156 ,  itemEmoji: ":ramen: ", name: "Japenese food", cost: 10, itemDescription: "\"You can never go wrong with chinese food! Oh wait.\"", category: "Food"}),
        CurrencyShop.upsert({ id: 6328 ,  itemEmoji: "🍪", name: "1.5 chicken nuggets", cost: 5, itemDescription: "CHICKEN NUGGIES", category: "Food"}),
        CurrencyShop.upsert({ id: 7566 ,  itemEmoji: ":coin:", name: "Premium Cookie", cost: 100, itemDescription: "What even is this?", category: "Food" }),
        CurrencyShop.upsert({ id: 9663 ,  itemEmoji: "<:coke:933696840023539743>", name: "Coke E Cola", cost: 3, itemDescription: "Don't want a lawsuit after all ;)", category: "Food" }),
        CurrencyShop.upsert({ id: 4795 ,  itemEmoji: "🍝", name: "Father's spaghetti", cost: 243, itemDescription: "For when you don't have a mom to cook for you.", category: "Food"}),
        CurrencyShop.upsert({ id: 3587 ,  itemEmoji: ":egg: :fish:", name: "Fish eggs", cost: 100, itemDescription: "YUM!", category: "Food"}),

        //Other
        CurrencyShop.upsert({ id: 5912 ,  itemEmoji: "🚙", name: "Fresh car smell in a bottle", cost: 40, itemDescription: "SO REFRESHING😍", category: "Weird Things"}),
        CurrencyShop.upsert({ id: 2097 ,  itemEmoji: "🪵", name: "Wooden plank", cost: 20, itemDescription: "Literally a wooden plank.", category: "Wooden"}),
    ];
    await Promise.all(stocks);
    console.log("Stocks database synced.");
    await Promise.all(shop);
    console.log("Currency database synced.");

    sequelize.close();
}).catch(console.error);
