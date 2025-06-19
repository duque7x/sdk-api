const { REST, STATES } = require("../index.js");
const client = new REST();
const chalk = require("chalk");

client.init().then(async (_) => {
  const guild = client.guilds.cache.get("1384423339128389642");

  const before = Date.now();
  console.log(chalk.bgBlue(`Starting to fetch data....`));

  const bet = guild.bets.cache.at(0);

  // await bet.setStatus(STATES.SHUTTED);
  //await bet.setWinner("412347257233604609");
  // await bet.setLoser("1044050359586394192");
  // await bet.addPlayer({ id: "877598927149490186", name: "dqu" });
 // await bet.addChannel({ id: "877598927149490186", type: "da tropa" })
 // await bet.add("embedMessageId", "1377731184095789086")

//  const channel = bet.channels.find(ew => ew.type.toLowerCase() === "da tropa");
  //bet.logs.addMessage("oi", "text", "duquesad")
  const { /* status, channels, winner, loser, players, embedMessageId, */ logs } = bet;
  console.log({ /* status, channels, winner, loser, players *//*  , embedMessageId, channels, */ logs });

  const now = Date.now();
  console.log(`It took`, chalk.bgRed(`${now - before}ms`), "to fetch all data.");
});