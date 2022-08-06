# Graveyard
#### Multipurpose Discord bot.

## Getting started

### Prerequisites

#### NodeJS

Download and install NodeJS version 18.x for your system from https://nodejs.org.

## Setting up the bot.

### Checking files.

Navigate to the `sources` folder in the root of the project and create the files from the containing `examples` folder, and then fill those files with the correct information.

### Installing npm modules

Make sure you install the necessary npm modules with `npm install --save`. And if you're a developer, also run `npm install eslint`

## Running the bot

Run `npm start` in the root directory of the project to start the bot.

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

#### Process structure

Here's an example of how a process with every possible file and folder type.

```
countingSystem/
  processEvents/
    discordCommandCreate/
      countingInfo.js

    discordInteractionCreate/
      logInteractions.js 

    discordMessageCreate/
      countingChannel.js

    discordMessageReactionAdd/
      logCountingChannelReactions.js

  processDatabaseSchemas/
    countingGuilds.js
    countingUsers.js

  processInfo.json
```

Let's explain all these files and folders.

`processInfo.json` contains information about your process stored in a JSON format. Eg. name, description and version.

The directory `processDatabaseSchemas/` contains `.js` files containing MongoDB database schemas.

The directory `processEvents/` contains files which are triggered by certain events. Eg. When a message is sent in Discord, or when a command is sent in Discord. The files in those directories are given a single data object containing whatever event they were triggered by, a message object, command interaction object etc. the Discord client, and the `globalUtilities/` folder.