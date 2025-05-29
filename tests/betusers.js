
const { REST, BASESTATUS, BETTYPES, Bet, BetUser, BetUsersManager, BetsManager, Collection, Guild, MATCHTYPES, MatchStatusTypesEnum, MatchTypesEnum, MatchesManager, Routes, STATES, User, UserManager } = require("../index.js");
const client = new REST();
const chalk = require("chalk");


client.init().then(async (_) => {
    const guild = client.guilds.cache.get("1336809872884371587");
    const before = Date.now();

    const [user, user2] = await Promise.all([
        guild.betUsers.fetch("877598927149490186", "duque7x"),
        guild.betUsers.fetch("1360976649855828089", "swagg")
    ])

    console.log({
        user,
        user2
    });

    await Promise.all([
        user.update({ wins: 100000, losses: 100000, credit: 100000, type: "add" }),
        user2.update({ wins: 100000, losses: 100000, credit: 100000, type: "add" }),
        user.update({ wins: 100000, losses: 100000, credit: 100000, type: "add" }),
        user2.update({ wins: 100000, losses: 100000, credit: 100000, type: "add" }),
    ]);
    console.log({
        user,
        user2
    }, 10^9);
    const now = Date.now();
    console.log(`It took`, chalk.bgRed(`${now - before}ms`), "to fetch all data.");
});
