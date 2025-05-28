
const client = new REST();
const { REST, BASESTATUS, BETTYPES, Bet, BetUser, BetUsersManager, BetsManager, Collection, Guild, MATCHTYPES, MatchStatusTypesEnum, MatchTypesEnum, MatchesManager, Routes, STATES, User, UserManager } = require("../index.js");


client.init().then(async (_) => {
    const guild = client.guilds.cache.get("1341399030282059776");
    await guild.add("betsChannels", {
        type: "1v1",
        id: "1212"
    });

    console.log({ guildChannels: guild.betsChannels });
});