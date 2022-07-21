const { SlashCommandBuilder } = require("@discordjs/builders");

const { Embed } = require(`${__basedir}/utilities/generalClasses.js`);

const { info } = require(`${__basedir}/configs/colors.json`);

const hugGifs = [
    "https://c.tenor.com/8Jk1ueYnyYUAAAAM/hug.gif",
    "https://c.tenor.com/gKlGEBBkliwAAAAM/anime-yuru-yuri.gif",
    "https://c.tenor.com/wUQH5CF2DJ4AAAAM/horimiya-hug-anime.gif",
    "https://c.tenor.com/9e1aE_xBLCsAAAAM/anime-hug.gif",
    "https://c.tenor.com/O3qIam1dAQQAAAAM/hug-cuddle.gif",
    "https://c.tenor.com/7zb6sgeEKIEAAAAM/snap.gif",
    "https://c.tenor.com/H7i6GIP-YBwAAAAM/a-whisker-away-hug.gif",
    "https://c.tenor.com/gmvdv-e1EhcAAAAM/weliton-amogos.gif",
    "https://c.tenor.com/5AsLKQTjbJ4AAAAM/kasumi-love-live.gif",
    "https://c.tenor.com/Y8_ITfFMQmMAAAAM/yue-arifureta.gif",
    "https://c.tenor.com/pHCT4ynbGIUAAAAM/anime-girl.gif",
    "https://c.tenor.com/o8RbiF5-9dYAAAAM/killua-hxh.gif",
    "https://c.tenor.com/DKMb2QPU7aYAAAAM/rin243109-blue-exorcist.gif",
    "https://c.tenor.com/rjR2Z67erfkAAAAM/death-saitama.gif",
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("hug")
        .setDescription("Hug someone if they're nice.")
        .addUserOption(option => option.setName("target").setDescription("The user to hug").setRequired(true)),

    async execute(interaction) {
        const hugGif = Math.floor(Math.random() * hugGifs.length);

        await interaction.reply({ embeds: [new Embed(`${interaction.user.username} hugs ${ await interaction.options.getUser("target").username}!`, null, null, null, hugGifs[hugGif], info)] });
    },
};
