/* eslint-disable no-unused-vars */
const { REST, STATES, BASESTATUS } = require("../index.js");
const client = new REST().setClientKey("877598927149490186");;
const chalk = require("chalk");

client.init().then(async (_) => {

  const before = Date.now();
  console.log(chalk.bgBlue(`Starting to fetch data....`));

 // const guild = client.guilds.cache.get("1336809872884371587");

  //await guild.add("channels", { id: "1377933427587940412", type: "dailyRank" });
  //await guild.set("dailyRankStatus", BASESTATUS.ON);
  /* 
    console.log({
      users: guild.betUsers.cache.map(u => u.wins).sort((a, b) => a - b)
    }); */
  console.log({ chs: client.guilds.cache });

  const now = Date.now();
  console.log(`It took`, chalk.bgRed(`${now - before}ms`), "to fetch all data.");
});