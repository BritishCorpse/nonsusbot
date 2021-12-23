# nonsusbot
Discord bot

## Running

Run `npm install` in the main directory to install the dependencies.
Run `npm start` in the main directory to run the bot.
Note that this will create a background thread for the main script. Use `ps ax` to find it and `kill PID` to kill it, where PID is the number next to the command in `ps ax`.
Edit the `config.json` file to change the bot prefix, bot token, and any api keys.

## Configuration files

### `config.json`
This is for bot wide configuration (api keys, bot token, bot name, etc.).
Make sure to put your bot token in the config.json file!

### `server_config.json` and `default_server_config.json`
This is for server wide configurations (prefixes, etc.).

### sqlite database
This is for the currency system.
