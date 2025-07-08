/* eslint-disable no-unused-vars */
const { REST, STATES, BETTYPES, } = require("../index.js");
const client = new REST().setClientKey("877598927149490186");
const chalk = require("chalk");

client.init().then(async (_) => {
  const guild = client.guilds.cache.get("1336809872884371587");

  const before = Date.now();
  console.log(chalk.bgBlue(`Starting to fetch data....`));

  const categories = guild?.categories;
  const category = await guild?.categories.create("duq");

  console.log({ category: category.type, chsCahce: categories.cache });

  await category.addId("199992755886358528");
  await category.addId("877598927149490186");
  await category.addId("1390818273607684177");
  await category.addId("199992755886358528");

  console.log({ category });

  const now = Date.now();
  console.log(`It took`, chalk.bgRed(`${now - before}ms`), "to fetch all data.");
});