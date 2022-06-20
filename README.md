# Graveyard
A Discord bot created to remove the need of filling a server up with an unnecessary amount of bots.

#THIS IS OUT OF DATE

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
  * 
## Setting up

Copy the `dev` branch onto your computer.

Make sure that the token stored in `./configs/graveyard_config.json` is there, and working.
Also make sure that the JSON key "development" is set to true, and that the keys "graveyardID", and "devServerID" have been set. "graveyardID" is the ID of the development version of Graveyard, and "devServerID" is the guildID of the server that you will be testing Graveyard in.

## Running

Install node.js from https://nodejs.org/. Make sure you isntall version 18.x or higher.

Run `npm install --save` in the main directory to install the dependencies.

Run `npm start` to update the database, and start the bot. 

Run `node main.js` to only start the bot. (This may cause bugs)

Run `node sync_db.js --force` to reset all database values. Only do this if you know what you're doing.

Run `git clean -dfX` to clean the directory (note that this will reset the database, deleting all users' balances and items, and server specific settings).

## Configuration folder

# colors.json
This file stores the colors used for things like embeds. It is important that we follow a coherent color scheme.

## Making new commands

### Files

Each command must be within a folder in `./commands/` (such as `./commands/general/help.js`).

### Properties

Each command must have a module.exports, containing the following properties:

| PROPERTY | TYPE | OPTIONAL | DESCRIPTION |
| :-: | :-: | :-: | :-: |
| name | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)<br>[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)> | | The name of the command. For aliases, use an array containing all the names. |
| description | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | | The description of the command shown in the help menu. |
| botPermissions | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)> | ✓ | Bot's discord permissions required to run the command (not including SEND\_MESSAGES). See [Discord.Permissions.FLAGS](https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS). |
| userPermissions | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)> | ✓ | User's discord permissions required to run the command. See [Discord.Permissions.FLAGS](https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS). |
| execute | [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)(message: [Discord.Message](https://discord.js.org/#/docs/main/stable/class/Message), args: [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>) => [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined) | | The function to be run when a user enters a command. |

<details><summary>Example</summary>

```js
module.exports = {
    name: "command",
    description: "A command that does things.",
    userPermissions: ["ADMINISTRATOR"],
    execute(message, args) {
        message.channel.send("I did stuff!");
        if (args[0])
            message.channel.send(`You entered a number! ${args[0]}`);
    },
};
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
