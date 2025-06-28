/* eslint-disable no-unused-vars */

const chalk = require("chalk");
const { REST, BASESTATUS, BETTYPES, Bet, BetUser, BetUsersManager, BetsManager, Collection, Guild, MATCHTYPES, MatchStatusTypesEnum, MatchTypesEnum, MatchesManager, Routes, STATES, User, UserManager } = require("../index.js");
const client = new REST().setClientKey("877598927149490186");;

client.init().then(async (_) => {
  const guild = client.guilds.cache.get("1336809872884371587");

  let before = Date.now();
  console.log(chalk.bgBlue(`Starting to fetch data....`));

  await client.guilds.fetchAll().catch(console.error);
  await guild.betUsers.fetchAll().catch(console.error);
  await guild.users.fetchAll().catch(console.error);
  await guild.matches.fetchAll().catch(console.error);
  await guild.bets.fetchAll().catch(console.error);

  const bet = guild.bets.cache.at(2);

  await bet.add("adminId", "877598927149490186").catch(console.error);
  await bet.add("creatorId", "877598927149490186").catch(console.error);
  await bet.add("winner", "877598927149490186").catch(console.error);

  await bet.addChannel({ type: "winner", id: "877598927149490186" }).catch(console.error);
  await bet.addChannel({ type: "loser", id: "877598927149490186" }).catch(console.error);
  await bet.addChannel({ type: "the one", id: "877598927149490186" }).catch(console.error);

  await bet.addConfirmed("cnsdwd", "877598927149490186").catch(console.error);
  await bet.addConfirmed("dwwd", "877598927149490186").catch(console.error);
  await bet.addConfirmed("llo", "877598927149490186").catch(console.error);

  await bet.addMessage({ type: "the troppe", id: "877598927149490186" }).catch(console.error);
  await bet.addMessage({ type: "the wwwww", id: "877598927149490186" }).catch(console.error);
  await bet.addMessage({ type: "the mano", id: "877598927149490186" }).catch(console.error);

  await bet.addPlayer({ name: "duque7x", id: "877598927149490186" }).catch(console.error);
  await bet.addPlayer({ name: "trezy", id: "1310975082025455666" }).catch(console.error);
  await bet.removePlayer({ name: "duque7x", id: "877598927149490186" }).catch(console.error);

  await bet.setLoser("877598927149490186").catch(console.error);
  await bet.setWinner("877598927149490186").catch(console.error);
  await bet.setStatus("off").catch(console.error);
  console.log(chalk.bgCyan(bet.toString()));

  const user = guild.betUsers.cache.get("877598927149490186");

  await user.set("mvps", 10).catch(console.error);
  await user.set("coins", 10).catch(console.error);
  await user.set("wins", 10).catch(console.error);
  await user.set("losses", 10).catch(console.error);
  await user.set("credit", 1000).catch(console.error);

  await user.update({ wins: 100, coins: 100, type: "add" }).catch(console.error);
  console.log(chalk.bgGrey(user.toString()));

  await guild.addCategory("llo", "877598927149490186").catch(console.error);
  await guild.addCategory("wwdwd", "877598927149490186").catch(console.error);
  await guild.addCategory("wdwd", "877598927149490186").catch(console.error);
  await guild.addCategory("wddwwwwwwwwwwwwwww", "877598927149490186").catch(console.error);

  //await guild.addChannel("llo", "877598927149490186").catch(console.error);
  //await guild.addChannel("wwdwd", "877598927149490186").catch(console.error);
  //await guild.addChannel("wdwd", "877598927149490186").catch(console.error);
  //await guild.addChannel("wddwwwwwwwwwwwwwww", "877598927149490186").catch(console.error);

  await guild.addRole("llo", "877598927149490186").catch(console.error);
  await guild.addRole("wwdwd", "877598927149490186").catch(console.error);
  await guild.addRole("wdwd", "877598927149490186").catch(console.error);
  await guild.addRole("wddwwwwwwwwwwwwwww", "877598927149490186").catch(console.error);

  await guild.addMessage("llo", "877598927149490186").catch(console.error);
  await guild.addMessage("wwdwd", "877598927149490186").catch(console.error);
  await guild.addMessage("wdwd", "877598927149490186").catch(console.error);
  await guild.addMessage("wddwwwwwwwwwwwwwww", "877598927149490186").catch(console.error);

  console.log(chalk.blackBright(guild.toString()));
  let now = Date.now();
  console.log(`It took`, chalk.bgRed(`${now - before}ms`), "to fetch all data.");



  before = Date.now();
  console.log(chalk.bgBlue(`Starting to fetch data with promise all...`));

  await Promise.all([
    client.guilds.fetchAll().catch(console.error),
    guild.betUsers.fetchAll().catch(console.error),
    guild.users.fetchAll().catch(console.error),
    guild.matches.fetchAll().catch(console.error),
    guild.bets.fetchAll().catch(console.error),
    bet.add("adminId", "877598927149490186").catch(console.error),
    bet.add("creatorId", "877598927149490186").catch(console.error),
    bet.add("winner", "877598927149490186").catch(console.error),
   //// bet.addChannel({ type: "winner", id: "877598927149490186" }).catch(console.error),
   // bet.addChannel({ type: "loser", id: "877598927149490186" }).catch(console.error),
   // bet.addChannel({ type: "the one", id: "877598927149490186" }).catch(console.error),
    bet.addConfirmed("cnsdwd", "877598927149490186").catch(console.error),
    bet.addConfirmed("dwwd", "877598927149490186").catch(console.error),
    bet.addConfirmed("llo", "877598927149490186").catch(console.error),
    bet.addMessage({ type: "the troppe", id: "877598927149490186" }).catch(console.error),
    bet.addMessage({ type: "the wwwww", id: "877598927149490186" }).catch(console.error),
    bet.addMessage({ type: "the mano", id: "877598927149490186" }).catch(console.error),
    bet.addPlayer({ name: "duque7x", id: "877598927149490186" }).catch(console.error),
    bet.addPlayer({ name: "trezy", id: "1310975082025455666" }).catch(console.error),
    bet.removePlayer({ name: "duque7x", id: "877598927149490186" }).catch(console.error),
    bet.setLoser("877598927149490186").catch(console.error),
    bet.setWinner("877598927149490186").catch(console.error),
    bet.setStatus("off").catch(console.error),
    user.set("mvps", 10).catch(console.error),
    user.set("coins", 10).catch(console.error),
    user.set("wins", 10).catch(console.error),
    user.set("losses", 10).catch(console.error),
    user.set("credit", 1000).catch(console.error),
    user.update({ wins: 100, coins: 100, type: "add" }).catch(console.error),
    guild.addCategory("llo", "877598927149490186").catch(console.error),
    guild.addCategory("wwdwd", "877598927149490186").catch(console.error),
    guild.addCategory("wdwd", "877598927149490186").catch(console.error),
    guild.addCategory("wddwwwwwwwwwwwwwww", "877598927149490186").catch(console.error),
   // guild.addChannel("llo", "877598927149490186").catch(console.error),
   /// guild.addChannel("wwdwd", "877598927149490186").catch(console.error),
   // guild.addChannel("wdwd", "877598927149490186").catch(console.error),
   // guild.addChannel("wddwwwwwwwwwwwwwww", "877598927149490186").catch(console.error),
    guild.addRole("llo", "877598927149490186").catch(console.error),
    guild.addRole("wwdwd", "877598927149490186").catch(console.error),
    guild.addRole("wdwd", "877598927149490186").catch(console.error),
    guild.addRole("wddwwwwwwwwwwwwwww", "877598927149490186").catch(console.error),
    guild.addMessage("llo", "877598927149490186").catch(console.error),
    guild.addMessage("wwdwd", "877598927149490186").catch(console.error),
    guild.addMessage("wdwd", "877598927149490186").catch(console.error),
    guild.addMessage("wddwwwwwwwwwwwwwww", "877598927149490186").catch(console.error),
  ]).catch(console.error);
  now = Date.now();
  console.log(`It took`, chalk.bgRed(`${now - before}ms`), "to fetch all data with promise all");
});