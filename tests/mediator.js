const { REST } = require("../index.js");
const client = new REST();
const chalk = require("chalk");

client.init().then(async (_) => {
  const guild = client.guilds.cache.get("1336809872884371587");

  const before = Date.now();
  console.log(chalk.bgBlue(`Starting to fetch data....`));

  /* guild.mediators.create({
    id: "877598927149490186",
    name: "duque7x",
    paymentLinks: ["https://discord.com/channels/1336809872884371587/1360958895446687877"]
  }) */

  const mediator = guild.mediators.cache.get("877598927149490186");

  //mediator.setLinks("https://web.whatsapp.com/");
  mediator.removeLink("https://web.whatsapp.com/");
  console.log({ mediator });

  const now = Date.now();
  console.log(`It took`, chalk.bgRed(`${now - before}ms`), "to add+remove a mediator.");
});