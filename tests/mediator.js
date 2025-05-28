const { REST } = require("../index.js");
const client = new REST();
const chalk = require("chalk");

client.init().then(async (_) => {
  const guild = client.guilds.cache.get("1341399030282059776");

  const before = Date.now();
  console.log(chalk.bgBlue(`Starting to fetch data....`));
  await guild.add("mediators", { id: "1258777695609815060", name: "duque", paymentLinks: ["https://chatgpt.com/c/68363898-d028-8011-a0d7-1b140afe053a"] });
  const now = Date.now();

  const med = guild.mediators.get("1258777695609815060");
  console.log({
    med,
    mediators: guild.mediators
  });


 // await guild.remove("mediators", { id: "1258777695609815060" });

  console.log(`It took`, chalk.bgRed(`${now - before}ms`), "to add+remove a mediator.");
});