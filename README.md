# Graveyard
Discord bot

## Running

Preferred node version is 16.x, 17.x.

Run `npm install` in the main directory to install the dependencies.

Run `npm start` to run the bot.

Run `npm log` to start the logging server and go to http://127.0.0.1:9001, or run `tail -f logs/*` to have it in your terminal.

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

