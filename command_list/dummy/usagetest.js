module.exports = {
    name: "usagetest",
    description: "test usage checking",
    developer: true,

    usage: [    // used both for documentation in help and for actually checking the usage of a command before running it
        {
            tag: "nothing", // the thing it shows in usage
            checks: {
                isempty: null, // when you want no argument
            },
        },
        {
            tag: "firstarg",
            example: "345", // for more help (optional)
            checks: {            // the test(s) the argument must pass to be valid; also the info the help command will show for each argument
                is: {not: "wasd"},          // checks if argument is exactly this (not inverts the check, so in this case cannot be "wasd")
                isinteger: null,            // checks if argument is a number
                // matches: /regex/,        // checks if argument matches the regex
                passes: {                // custom function for more complex logic if needed, but shouldn't be needed
                    func: arg => arg === "123",
                    description: not => `is ${not ? "not " : ""}123`, // custom description in the usage
                },
            },
            next: [       // next argument when first arg passes the test
                {
                    tag: "secondarg",
                    checks: {
                        is: "second",
                    },
                },
                {
                    tag: "secondargv2",
                    checks: {
                        is: "secondv2",
                    },
                },
            ],
        },
    ],

    execute (message, args) {
        message.reply("i worked yay");
    }
};
