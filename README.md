# Graveyard
Discord bot

## Running

Run `npm install` in the main directory to install the dependencies.

This bot must be run using npm, as some features require it. Running `node index.js` or `node .` will not work.

Run `npm start` in the main directory to run the bot, or `npm run heroku-start` if running on heroku host.

Note that if running `npm run heroku-start`, a background thread will be created for the main script. Use `ps ax` to find it and `kill PID` to kill it, where PID is the number next to the command in `ps ax`.

Run `node init_db.js --force` to re-initialize the database, to reset the currency system.

Edit the `config.json` file to change the bot name, default prefix, discord bot token, and api keys.

Run `npm run clean` to clean the directory (will delete `node_modules` and other files).

## Configuration files

### `config.json`

This is for bot wide configuration (api keys, bot token, bot name, etc.).
Make sure to put your bot token in the config.json file!

### `server_config.json` and `default_server_config.json`

This is for server wide configurations (prefixes, etc.).

### `development_config.json`

This is for development options (discord development servers, discord developer users, etc.).

### sqlite database

This is for the currency system.
