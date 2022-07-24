# Graveyard
#### Multipurpose Discord bot.

## Getting started

### Prerequisites

#### NodeJS

Download and install NodeJS version 18.x for your system from https://nodejs.org.

#### Git

###### Windows

Download and install any recent version of Git from https://git-scm.com/download/win.

###### Mac

Download and install any recent version of Git from https://git-scm.com/download/mac.

###### Linux

Distros that use APT: `sudo apt-get install git`.

Distros that use Pacman: `sudo pacman -S git`.

## Setting up the bot.

### Clone this github repository

Open up CMD if you're on windows, and terminal if you're on OSX/Linux.
Type `git clone { URL to this website }`.

If prompted for a username and password, enter your GitHub username, and paste in your GitHub authentication token.

Keep your command prompt / terminal window open.

### Move into the repository

Do `dir` on windows, and `ls` on other operating systems, and find the bot's directory.
It should be called something along the lines of `bot` or `Graveyard-Dev-bot`.

Then run `cd { directory that you just found }` to get into it.

### Checking files.

List the files in your directory again, and then look for a folder called `sources`. 
Change your directory in to that folder.

Once you're in `sources`, look for a file called `botConfigs.json`.

Open this file.

###### Windows/Mac

Navigate to this folder in file explorer, and open with notepad/any other text editor.

###### Linux

Install nano or vim, then do `nano botConfigs.json`.

Make sure the key `token`, is set to a jumble of letters. It should look someting like this.
`OPJFOSIFJ03JFsdklMSWEFJIA0sjoidf.43Kjfsdfklwjea-3KfjsidLc.weofijsdLsj-` < Example token.

WARNING: Don't leak your bot token, since it can be used to spam and raid servers!

If the token isn't set, contact a developer to get yourself a copy.

Find the file `main.js` in the root directory of the project and open it in a text editor.

Look for a line that says, `client.once("ready", async => { ... })`. Inside this arrow function, look for the line `await mongoose.connect("");`.

Ensure that it is connecting to an actual database. If you are unsure whether or not the information is correct, contact another developer.

### Installing npm modules

Navigate back to your projects root directory.

Run `npm install --save`. 

On Linux you might get an error saying something along the lines of `npm was not found`. This means you will have to install npm separately.

###### If you have APT

Run `sudo apt-get install npm`.

###### If you have Pacman

Run `sudo pacman -S npm`.

If you get warnings whilst running `npm install`, make sure to read them. If it says that your node version is note supported for a package, it means that the version of node you have installed is too old. Your version must be 18.x or higher.

## Running the bot

Run `node .` in the root directory of the project to start the bot.

If you see logs in your terminal that look someting like this:

`Sat, 23 Jul 2022 12:39:01 GMT: Added commands to client collection.`
`Sat, 23 Jul 2022 12:39:01 GMT: Event listeners started.`
`Sat, 23 Jul 2022 12:39:01 GMT: Registered application commands in the development server.`
`Sat, 23 Jul 2022 12:39:02 GMT: Started new bot instance.`

That means you're good to go!

## Development

This section handles how to create processes, naming schematics, error handling and deprecated code.

### Naming rules

Variable names, folder names, file names, and mostly everything uses camelCase.

The only notable exception for this is database collection names and class names, which use PascalCase.

### Deprecated/Legacy code

If your code no longer works, or is no longer required, move in to the `legacy` folder located in the root directory of the project.
We keep legacy code, because sometimes it might contain things we need later on.

### Global utilities

Global utilities are classes stored in the `globalUtilities` folder located at the root of the project.

They are used by most processes, and removing / editing them may cause major errors. Be certain that when editing global utilities that method names, method parameters and constructor parameters stay the same. Make sure that there are no bugs in global utilities when you make a pull request.

#### Creating global utilities

To create a global utility, create file in the `globalUtilities` located at the root of the project. You can name this file whatever, just make sure that you follow our naming rules and that the file ends in `.js`.

Inside the global utility file, create your class and export it using `module.exports`.

### Processes

The majority of your development will be creating and managing processes.

Processes are things like a currency system, where each user of a server has a certain amount of coins they can spend on things.
Or a command handler which executes commands.

#### Creating a process folder

Look for a folder in the root directory of the project called `processes`.
Create a new folder in there with a name of your liking. For this example we will be creating a folder called `countingSystem`.

#### Creating files

##### Required files

Each process MUST have a folder called `commands`

Navigate in to the folder you just created, and create a file called `processInfo.json`.

In that file you must specify these things.

```
{
    The name of your process. Try to make it similar if not the same as your process folders name.
    "name": "countingSystem",
    Describe what your process will do briefly.
    "description": "Handles messages sent in the counting channel.",
    The version of your process
    "version": "0.0.1",
    Whatever client event your process will be triggered by.
    "triggeredBy": "messageCreate"
}
```

Save and exit that file.

Create another file in your process folder called `main.js`.
This is the file that will be executed once the requirements in `processInfo.json` are met.

The basis of your `main.js` file should look something like this.

```
module.exports = {
    async execute(message/interaction/guildMember) {

    }
};
```

You will be given different parameters in your `execute()` depending on what client event you chose to emit your process. For example, if you chose messageCreate, you will be passed the message that was created.

No checks are done on the messages / interactions / message reactions that are sent, so if you only wan't let's say command interactions, you will have to check for that yourself.

##### Optional files

###### Database schema
If you want a database schema for your process, create a file called dataBaseSchema(SchemaName).js

Here's an example of what a database schema looks like.

```
const mongoose = require("mongoose");

const databaseSchema = new mongoose.Schema({
    userId: { type: String, require: true, unique: true },
    guildId: { type: String, require: true },

    correctlyCounted: { type: Number, require: true, default: 0 },
    incorrectlyCounted: { type: Number, require: true, default: 0 }
});

const model = mongoose.model("CountingUser", databaseSchema);
 
module.exports = model;
```

Let's break down this file. We require mongoose for database access and then declare a new mongoose.Schema(). We pass in userId, guildId, correctlyCounted and incorrectlyCounted as our keys for the collection.

Here are some basic parameters that you can use when defining keys in a new mongoose schema.

`type, can be: String, Number, Array, Object` Type defines the type which the database expects when creating a new object for this schema.
`require, can be: true/false` If that key is required to be defined.
`unique, can be: true/false` Whether or not there can be multiple objects in this schema, with the same value of this key.
`default, can be: anything` If a value isn't defined when creating a new object in this schema, it will use this value.

###### Commands
If you want commands for your process, create a directory called `commands` in the root directory of your process.

Then, to create a command file just create a new file and call it anything, but make sure that the files name ends with `Command.js`. (Case sensitive).

Here's a basic example of what a command looks like. 

```
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("A test command you can use to check that the bot is responding."),
        
    async execute(interaction) {
        await interaction.reply("lorem ipsum");
    }
};
```

Let's break down this file.

We require SlashCommandBuilder from discord.js to create a new command.

We then create a module.exports for the file containing a couple things. 

Data, which is the slash command,
And an async execute() function.

If your command will take longer than 3 seconds to reply, make sure to ```await interaction.deferReply();``` as early as possible.
And when you have your reply, write ```await interaction.editReply()```.

If your command will take less than 3 seconds to reply, you can use the regular .reply() method.

###### Function/Class files

If main.js file is getting lengthy, you can create a file called `utilities.js` containing your required functions and or classes.
