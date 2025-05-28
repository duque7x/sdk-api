const { REST, STATES } = require("../index.js");
const client = new REST();
const chalk = require("chalk");

client.init().then(async (_) => {
  const guild = client.guilds.cache.get("1341399030282059776");

  const before = Date.now();
  console.log(chalk.bgBlue(`Starting to fetch data....`));

  await client.guilds.fetchAll();
  await guild.betUsers.fetchAll();
  await guild.users.fetchAll();
  await guild.matches.fetchAll();
  await guild.bets.fetchAll();


  const user = guild.betUsers.cache.at(0);
  console.log({ userBefore: user });
  await user.update({
    wins: 100,
    betsPlayed: [203203],
    credit: 10 * 1.10,
    //type: "add"
  })
  console.log({ userAfter: user });

  const bet = await guild.bets.fetch("68362b93af6146b3f1de7b1a");

  console.log({ statusBefore: bet.status });
  await bet.set("status", STATES.CREATED);
  console.log({ statusAfter: bet.status });


bet.set("mediatorId")
  const me = guild.betUsers.cache.get("877598927149490186");

  await me.update({
    wins: 10,
    credit: 10,
    betsPlayed: ["68362b93af6146b3f1de7b1a", "68362b93af6146b3f1de7b1a", "1355544935662883100"],
    losses: 10,
    mvps: 10,
    blacklist: true,
    type: "add"
  });

  console.log({ me });
  const now = Date.now();
  console.log(`It took`, chalk.bgRed(`${now - before}ms`), "to fetch all data.");
});
process.on('warning', (warning) => {
  console.warn(warning.name);    // e.g. 'Warning'
  console.warn(warning.message); // e.g. 'Accessing non-existent property...'
  console.warn(warning.stack);   // Full stack trace
});
