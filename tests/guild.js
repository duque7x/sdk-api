const { REST, STATES, BASESTATUS } = require("../index.js");
const client = new REST().setClientKey("877598927149490186");;
const chalk = require("chalk");

client.init().then(async (_) => {

  const before = Date.now();
  console.log(chalk.bgBlue(`Starting to fetch data....`));

  const guild = client.guilds.cache.get("1336809872884371587");

  console.log({
    permissions: guild.permissions
  })

  const perm  = await guild.permissions.setPermission("manage_bot", '877598927149490186');
  console.log({
    perm
  });
  
  const now = Date.now();
  console.log(`It took`, chalk.bgRed(`${now - before}ms`), "to fetch all data.");
});