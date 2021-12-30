module.exports = {
  apps : [{
    name   : "discord-bot",
    script : "./index.js",
    error_file: "./logs/err.log",
    out_file: "./logs/out.log",
    detached: true,
  }]
}
