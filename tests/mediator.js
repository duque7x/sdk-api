const { REST } = require("../index.js");
const client = new REST().setClientKey("877598927149490186");
const chalk = require("chalk");

client.init().then(async () => {
  const guild = client.guilds.cache.get("1336809872884371587");
  // console.log({ guild });

  const before = Date.now();
  console.log(chalk.bgBlue(`Starting to fetch data....`));
  /* 
    const mediator = await guild.mediators.create({
      id: "877598927149490186",
      name: "duque7x",
      paymentLinks: ["https://discord.com/channels/1336809872884371587/1360958895446687877"]
    }); */

  console.log({ mediators: guild.mediators.cache });


  const mediatorCache = guild.mediators.cache.get("877598927149490186");
  await mediatorCache.setLinks("https://paypal.me/josue7x69");

  mediatorCache.removeLink("https://web.whatsapp.com/");
  console.log({ mediatorCache, ch: guild.mediators.cache });
  //console.log({ mediator });

  const now = Date.now();
  console.log(`It took`, chalk.bgRed(`${now - before}ms`), "to add+remove a mediator.");
});