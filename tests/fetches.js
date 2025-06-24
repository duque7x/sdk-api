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

  const now = Date.now();
  console.log(`It took`, chalk.bgRed(`${now - before}ms`), "to fetch all data.");
});
process.on('warning', (warning) => {
  console.warn(warning.name);    // e.g. 'Warning'
  console.warn(warning.message); // e.g. 'Accessing non-existent property...'
  console.warn(warning.stack);   // Full stack trace
});
