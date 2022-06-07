module.exports = {
    name: "usernamenormalizer",
    async execute(client) {
        client.on("guildMemberUpdate", async newMember => {
            const allowIllegalNames = await client.serverConfig.get(newMember.guild.id).allow_illegal_names;
            if (allowIllegalNames === "true") return;

            const normalizedName = newMember.displayName.normalize("NFKC");
            newMember.setNickname(normalizedName, "Normalized a username.");
        });
    }
};