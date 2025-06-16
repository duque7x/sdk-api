
const { REST, BASESTATUS, BETTYPES, Bet, BetUser, BetUsersManager, BetsManager, Collection, Guild, MATCHTYPES, MatchStatusTypesEnum, MatchTypesEnum, MatchesManager, Routes, STATES, User, UserManager } = require("../index.js");
const client = new REST();


client.init().then(async (_) => {
    console.log(client.guilds.cache);

    const guild = client.guilds.cache.get("1341399030282059776");
    const match = await guild.matches.create({ creatorId: "877598927149490186", type: MATCHTYPES.FourVFour })
    console.log({ match })
});
