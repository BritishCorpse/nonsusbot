module.exports = {
    name: ["greet", "hello"],
    description: "Says hello to someone!",

    usage: [
        { tag: "user", checks: {isuseridinguild: null}, example: "<@!786301097953591326>" }
    ],

    async execute (message, args) {
        message.channel.send(`Hello, ${args[0]}`);
    }
};
