module.exports = {
    name: ["greet", "hello"],
    description: "Says hello to someone!",

    usage: [
        { tag: "user", checks: {isuseringuild: null} }
    ],

    execute (message, args) {
        message.channel.send(`Hello, ${args[0]}`);
    }
}
