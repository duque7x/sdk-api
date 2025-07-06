/* eslint-disable no-unused-vars */
const { REST, STATES, BETTYPES, } = require("../index.js");
const client = new REST().setClientKey("877598927149490186");
const chalk = require("chalk");

client.init().then(async (_) => {
  const guild = client.guilds.cache.get("1336809872884371587");

  const before = Date.now();
  console.log(chalk.bgBlue(`Starting to fetch data....`));

  // const bet = await guild.bets.fetch("685d42cf3a5244a6cfaa1e5d");
  let bet = guild.bets.cache.get("685d9ce8ea270b2de8f6f57c");
  if (!bet) bet = await guild.bets.create({ creatorId: "877598927149490186", mode: "misto", price: 12, type: BETTYPES.OneVOne })
  // await bet.setStatus(STATES.SHUTTED);
  //await bet.setWinner("412347257233604609");
  // await bet.setLoser("1044050359586394192");
  // await bet.addPlayer({ id: "877598927149490186", name: "dqu" });
  // await bet.addChannel({ id: "877598927149490186", type: "da tropa" })
  // await bet.add("embedMessageId", "1377731184095789086")

  //  const channel = bet.channels.find(ew => ew.type.toLowerCase() === "da tropa");
  //bet.logs.addMessage("oi", "text", "duquesad")


  //await bet.addChannel({ id: "1387519424940081355", type: "fr" })

  /*  await Promise.all([
     bet.addChannel({ id: "1387519424940081355", type: "frw" }),
     bet.addChannel({ id: "1387519424940081355", type: "234" }),
     bet.addChannel({ id: "1387519424940081355", type: "f22erw" }),
     bet.addChannel({ id: "1387519424940081355", type: "2e2e2e" })]).catch(console.error);
     console.log({ bet }); */

  //const { /* status, channels, winner, loser, players, embedMessageId, */ logs, messages, channels } = bet;

  // const ch = await bet.channels.cache.get("1");
  // const ch2 = await bet.channels.create({ id: "dq", type: "2" });
  //const ch3 = await bet.channels.create({ id: "dq", type: "3" });

  //await bet.channels.delete("frw");

  //  console.log({ channelBefore: bet?.channels?.cache });
  await bet.channels.setTo([{ id: "save", type: "23444" }, { id: "lol", type: "465675" }]);
  console.log({ channelAfter: bet.channels.cache });

  await bet.channels.deleteAll();
  console.log({ channelAfter: bet.channels.cache });

  const now = Date.now();
  console.log(`It took`, chalk.bgRed(`${now - before}ms`), "to fetch all data.");
});