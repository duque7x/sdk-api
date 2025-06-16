
const { REST, BASESTATUS, BETTYPES, Bet, BetUser, BetUsersManager, BetsManager, Collection, Guild, MATCHTYPES, MatchStatusTypesEnum, MatchTypesEnum, MatchesManager, Routes, STATES, User, UserManager } = require("../index.js");
const client = new REST();


client.init().then(async (_) => {
    console.log(client.guilds.cache);
    
    const guild = client.guilds.cache.get("1341399030282059776");
    await guild.add("betsChannels", {
        type: "1v1",
        id: "1376927377426485290"
    });

    console.log({ });
    
    const user = await guild.betUsers.fetch("877598927149490186", "duque7x");
    console.log({ userbef: user });
    await user.update({ coins: 1233222, type: "add" });
    console.log({ userAf: user });
});
