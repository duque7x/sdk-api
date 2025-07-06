/* eslint-disable no-unused-vars */
const { REST, STATES, BETTYPES, } = require("../index.js");
const client = new REST().setClientKey("877598927149490186");
const chalk = require("chalk");

client.init().then(async (_) => {
  const guild = client.guilds.cache.get("1336809872884371587");

  const before = Date.now();
  console.log(chalk.bgBlue(`Starting to fetch data....`));

  const categories = guild?.categories;
  const category = await guild?.categories.cache.get("duq");


  await categories.delete("wwdwd");
  console.log({ category: category.type, chsCahce: categories.cache });

  category.addId("199992755886358528")


  const now = Date.now();
  console.log(`It took`, chalk.bgRed(`${now - before}ms`), "to fetch all data.");
});