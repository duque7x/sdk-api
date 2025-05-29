const { REST, STATES } = require("../index.js");
const client = new REST();
const chalk = require("chalk");

client.init().then(async (_) => {
  const guild = client.guilds.cache.get("1341399030282059776");

  const before = Date.now();
  console.log(chalk.bgBlue(`Starting to fetch data....`));

  const bet = await guild.bets.fetch("68362b93af6146b3f1de7b1a");
  // await bet.setStatus(STATES.SHUTTED);
  //await bet.setWinner("412347257233604609");
  // await bet.setLoser("1044050359586394192");
  // await bet.addPlayer({ id: "877598927149490186", name: "dqu" });
  // await bet.addChannel({ id: "877598927149490186", type: "wdwdwdwdwd" })

  const channel = bet.channels.find(ew => ew.type.toLowerCase() === "wdwdwdwdwd");
  const { status, channels, winner, loser, players } = bet;
  console.log({ /* status, channels, winner, loser, players */ channel });

  const now = Date.now();
  console.log(`It took`, chalk.bgRed(`${now - before}ms`), "to fetch all data.");
});