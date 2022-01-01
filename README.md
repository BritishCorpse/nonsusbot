# Graveyard
Discord bot

## Running

Preferred node version is 16.x, 17.x.

Run `npm install` in the main directory to install the dependencies.

Run `npm start` to run the bot.

Run `npm run log` to start the logging server and go to http://127.0.0.1:9001, or run `tail -f logs/*` to have it in your terminal.

Run `npm run status` to see the status of the bot's process.

Run `npm stop` to stop running the bot.

Run `node init_db.js --force` to re-initialize the database, to reset the currency system.

Edit the `config.json` file to change the bot name, default prefix, discord bot token, and api keys.

Run `git clean -dfX` to clean the directory.

## Configuration files

### `config.json`

This is for bot wide configuration (api keys, bot token, bot name, etc.).
Make sure to put your bot token in the config.json file!

### `server_config.json` and `default_server_config.json`

This is for server wide configurations (prefixes, etc.).

### `development_config.json`

This is for development options (discord development servers, discord developer users, testing bot configs, etc.).

### sqlite database

This is for the currency system.

### `jest.config.js`

This is for testing the bot. Do not edit.

### `ecosystem.config.js`

This is for running the bot. Do not edit.

## Making new commands

### Files

Each command must be within a folder in `./command_list/` (such as `./command_list/general/help.js`).

### Properties

Each command must have a module.exports, containing:

| PROPERTY | TYPE | OPTIONAL | DESCRIPTION |
| :-: | :-: | :-: | :-: |
| name | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)<br>[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)> | no | The name of the command. For aliases, use an array containing all the names. |
| description | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | no | The description of the command shown in the help menu. |
| userPermissions | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)> | yes | Discord permissions required to run the command. See [Discord.Permissions.FLAGS](https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS) |
| usage | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)> | no | Defines how a command should be used, with all arguments possible. See [Usage]() |
| execute | [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)(message: [Discord.Message](https://discord.js.org/#/docs/main/stable/class/Message), args: [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>) => undefined | no | The function to be run when a user enters a command. |

<details><summary>Example</summary>

```js
module.exports = {
    name: "command",
    description: "A command that does things.",
    userPermissions: ["ADMINISTRATOR"],
    
    usage: [
        { tag: "number", checks: {isinteger: null} },
        { tag: "nothing" },
    ],

    execute(message, args) {
        message.channel.send("I did stuff!");
        if (args[0])
            message.channel.send(`You entered a number! ${args[0]}`);
    },
};
```

</details>

### Usage

The usage property of a command's module.exports defines the rules for how a command is to be used.


