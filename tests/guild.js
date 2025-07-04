const { REST, STATES, BASESTATUS } = require("../index.js");
const client = new REST();
const chalk = require("chalk");

client.init().then(async (_) => {

  const before = Date.now();
  console.log(chalk.bgBlue(`Starting to fetch data....`));

  const guild = await client.guilds.cache.get("1336809872884371587");

  //await guild.add("channels", { id: "1377933427587940412", type: "dailyRank" });
  //await guild.set("dailyRankStatus", BASESTATUS.ON);
/* 
  console.log({
    users: guild.betUsers.cache.map(u => u.wins).sort((a, b) => a - b)
  }); */
  await guild.addRole("#autoClean", "1336809872884371587");
  console.log({rol : guild.roles });
  
  const now = Date.now();
  console.log(`It took`, chalk.bgRed(`${now - before}ms`), "to fetch all data.");
});