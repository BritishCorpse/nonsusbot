const { SlashCommandBuilder } = require("@discordjs/builders");

const { Embed } = require(`${__basedir}/utilities/generalClasses.js`);

const { info } = require(`${__basedir}/configs/colors.json`);

const punchGifs = [
    "https://c.tenor.com/BoYBoopIkBcAAAAC/anime-smash.gif",
    "https://c.tenor.com/p_mMicg1pgUAAAAM/anya-forger-damian-spy-x-family.gif",
    "https://c.tenor.com/UH8Jnl1W3CYAAAAM/anime-punch-anime.gif",
    "https://c.tenor.com/SwMgGqBirvcAAAAM/saki-saki-kanojo-mo-kanojo.gif",
    "https://c.tenor.com/wYyB8BBA8fIAAAAM/some-guy-getting-punch-anime-punching-some-guy-anime.gif",
    "https://c.tenor.com/EvBn8m3xR1cAAAAM/toradora-punch.gif",
    "https://c.tenor.com/xWqmJMePsqEAAAAM/weaboo-otaku.gif",
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
        .setName("punch")
        .setDescription("Punch someone if they're being rude.")
        .addUserOption(option => option.setName("target").setDescription("The user to punch").setRequired(true)),

    async execute(interaction) {
        const punchGif = Math.floor(Math.random() * punchGifs.length);

        await interaction.reply({ embeds: [new Embed(`${interaction.user.username} punches ${ await interaction.options.getUser("target").username}!`, null, null, null, punchGifs[punchGif])], info });
    },
};
