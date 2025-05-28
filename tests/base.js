
const { REST, BASESTATUS, BETTYPES, Bet, BetUser, BetUsersManager, BetsManager, Collection, Guild, MATCHTYPES, MatchStatusTypesEnum, MatchTypesEnum, MatchesManager, Routes, STATES, User, UserManager } = require("../index.js");
const client = new REST();


client.init().then(async (_) => {
    const guild = client.guilds.cache.get("1341399030282059776");
    await guild.add("betsChannels", {
        type: "1v1",
        id: "1376927377426485290"
    });

    console.log({ guildChannels: guild.betsChannels });
});