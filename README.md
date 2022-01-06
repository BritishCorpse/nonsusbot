# Graveyard
A general purpose Discord bot.

Table of contents
=================

* [Running](#running)
* [Configuration files](#configuration-files)
  * [config.json](#configjson)
  * [server_config.json and default_server_config.json](#server_configjson-and-default_server_configjson)
  * [development_config.json](#development_configjson)
  * [database.sqlite](#databasesqlite)
  * [jest.config.js](#jestconfigjs)
  * [ecosystem.config.js](#ecosystemconfigjs)
* [Making new commands](#making-new-commands)
  * [Files](#files)
  * [Properties](#properties)
  * [Usage](#usage)
     * [Option](#option)
        * [Checks](#checks)
           * [Passes](#passes)
           * [Not](#not)
     * [Circular options](#circular-options)

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

| PROPERTY | TYPE | OPTIONAL | DESCRIPTION |
| :-: | :-: | :-: | :-: |
| bot\_name | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | | The name of the bot. |
| bot\_token | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | | Discord token of the bot. See [Your token](https://discordjs.guide/preparations/setting-up-a-bot-application.html#your-token). |
| dictionary\_api\_key | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | | Webster's dictionary api key. See [Register for a Developer Account](https://dictionaryapi.com/register/index) (select the Collegiate Dictionary in the API keys). |
| x\_rapidapi\_key | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | | The rapidapi api key. See [RapidAPI](https://rapidapi.com/auth/sign-up). |
| very\_ninja\_php\_session_id | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | | The very.ninja PHPSESSID (does not work anymore). |

### `server_config.json` and `default_server_config.json`

This is for server wide configurations (prefixes, etc.).

### `development_config.json`

This is for development options (discord development servers, discord developer users, testing bot configs, etc.).

### `database.sqlite`

This is for the currency system.

### `jest.config.js`

This is for testing the bot. Do not edit.

### `ecosystem.config.js`

This is for running the bot. Do not edit.

## Making new commands

### Files

Each command must be within a folder in `./command_list/` (such as `./command_list/general/help.js`).

### Properties

Each command must have a module.exports, containing the following properties:

| PROPERTY | TYPE | OPTIONAL | DESCRIPTION |
| :-: | :-: | :-: | :-: |
| name | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)<br>[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)> | | The name of the command. For aliases, use an array containing all the names. |
| description | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | | The description of the command shown in the help menu. |
| userPermissions | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)> | ✓ | Discord permissions required to run the command. See [Discord.Permissions.FLAGS](https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS). |
| developer | [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) | ✓ | If true, command is developer only (usable by developers in specified development servers). |
| usage | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)> | | Defines how a command should be used, with all arguments possible. See [Usage](#usage) |
| execute | [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)(message: [Discord.Message](https://discord.js.org/#/docs/main/stable/class/Message), args: [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>) => [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined) | | The function to be run when a user enters a command. |

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

It is an array of options where each option is an [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) that defines a possible route for the argument to pass. See [Option](#option).

If no option passes, the usage is sent in the channel the user sent the command in.
Descriptions are automatically generated from the usage [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).

If multiple options pass, the `CommandUsageError` error will be thrown.

<details><summary>Example</summary>

```js
// Different options for whether an argument was given or not.
[
    { tag: "something", checks: {isempty: {not: null}} },  // passes if an argument was given
    { tag: "nothing", checks: {isempty: null} },           // passes if an argument was not given
]

// Don't do this! It will throw a CommandUsageError because multiple options are valid.
[
    { tag: "something", checks: {isempty: {not: null}} },  // passes if an argument was given
    { tag: "nothing", checks: {} },                        // passes always
]
```

</details>

#### Option

An option is an [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) that represents a possible route the argument can pass.

It must contain the following properties:

| PROPERTY | TYPE | OPTIONAL | DESCRIPTION |
| :-: | :-: | :-: | :-: |
| tag | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | | The name of an argument in an option. |
| example | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | ✓ | An example to display when showing the usage of a command. |
| checks | [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | ✓ | The checks the argument string must pass for it to continue down the option. See [Checks](#checks). |
| circular | [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | ✓ | Whether the option references itself in its next property. Must be set in order to get an infinite amount of arguments. This option is automatically set by the [circularUsageOption](#circular-option) function. |
| next | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) | ✓ | A list of the next options (identical to the usage). See [Usage](#usage). |

<details><summary>Example</summary>

```js
{
    tag: "something",
    example: "12345",
    checks: {
        isinteger: null,        // checks if the first argument string is an integer
    },
    next: [
      {
          tag: "something-else",
          example: "",
          checks: {
              is: {not: "wasd"} // checks if the second argument string is not "wasd"
          },
      }
    ],
}
```

</details>

##### Checks

Checks is an object that defines rules that the argument to pass to continue down the option.

If checks is [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined) or empty, the option will always pass.

A check can be inverted by replacing the value with `{not: value}`. See [Not](#not).

| PROPERTY | TYPE | OPTIONAL | DESCRIPTION |
| :-: | :-: | :-: | :-: |
| is | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | ✓ | Argument is exactly the string. |
| isin | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)> | ✓ | Argument is exactly one of the strings in the array. |
| isempty | [null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null) | ✓ | Argument is not given. |
| isinteger | [null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null) | ✓ | Argument is an integer. |
| ispositiveinteger | [null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null) | ✓ | Argument is an integer greater than 0. |
| isnegativeinteger | [null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null) | ✓ | Argument is an integer less than 0. |
| isintegerbetween | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)> | ✓ | Argument is an integer greater than or equal to the first value in the array and less than the second value in the array. |
| matches | [RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | ✓ | Argument matches the regular expression somewhere in the string. |
| matchesfully | [RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | ✓ | Argument matches the regular expression fully. |
| isuseridinguild | [null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null) | ✓ | Argument is the ID or mention of a user in the guild the message was sent in. |
| isbanneduseridinguild | [null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null) | ✓ | Argument is the ID or mention of a banned user in the guild the message was sent in. |
| passes | [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | ✓ | Argument passes a custom rule. See [Passes](#passes). |

<details><summary>Example</summary>

```js
{
    is: "word",   // checks that the argument is exactly "word"
}
```

</details>

###### Passes

If the check you need is not available, you can create one.

| PROPERTY | TYPE | OPTIONAL | DESCRIPTION |
| :-: | :-: | :-: | :-: |
| func | [Function](arg: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)) | | Must return a [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) determining whether the argument passed or not. |
| description | [Function](not: [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean), value: any) | | The description shown to automatically generate the usage shown to users. The not argument is true if the check was inverted (see [Not](#not)). |

<details><summary>Example</summary>

```js
{
    func: arg => arg.length === 9,
    description: (not, value) => `${not ? "does not have" : "has"} a length of 9`,
}
```

</details>

###### Not

All checks can be inverted by replacing the value with `{not: value}`.

**Note:** when a check is inverted, the option will pass if the argument is not given.
To disable this behavior, add the `isempty: {not: null}` check.

#### Circular options

Sometimes an infinite number of arguments is required, such as when getting a message from the user.

This can be done using the `circularUsageOption` function in [functions.js](https://github.com/BritishCorpse/nonsusbot/blob/7810e96b45799307853ff871ab90870157748f2f/functions.js#L227).

It will take an option, and add append an option referencing itself to the [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) of its `next` property.
It will also set the `circular` property to `true`.

| ARGUMENT | TYPE | OPTIONAL | DESCRIPTION |
| :-: | :-: | :-: | :-: |
| option | [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | | The option to be made infinite. |

Returns: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).
