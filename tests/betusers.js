/* eslint-disable no-unused-vars */

const { REST, BASESTATUS, BETTYPES, Bet, BetUser, BetUsersManager, BetsManager, Collection, Guild, MATCHTYPES, MatchStatusTypesEnum, MatchTypesEnum, MatchesManager, Routes, STATES, User, UserManager } = require("../index.js");
const client = new REST().setClientKey("877598927149490186");
const chalk = require("chalk");


client.init().then(async (_) => {
    const guild = client.guilds.cache.get("1336809872884371587");
    const before = Date.now();

    const now = Date.now();
    console.log(`It took`, chalk.bgRed(`${now - before}ms`), "to fetch all data.");
});
