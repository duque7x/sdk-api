/* eslint-disable no-unused-vars */
const { REST, STATES, BETTYPES, } = require("../index.js");
const client = new REST().setClientKey("877598927149490186");
const chalk = require("chalk");

client.init().then(async (_) => {
  const guild = client.guilds.cache.get("1336809872884371587");

  const before = Date.now();
  console.log(chalk.bgBlue(`Starting to fetch data....`));

  const { tickets } = guild;
  /*  const ticket = await tickets.create("877598927149490186", "support");
 
   await Promise.all([
     await ticket.setAdminId("199992755886358528"),
     await ticket.setClosedById("199992755886358528"),
     await ticket.setCustomerRating(10),
     await ticket.setType("support"),
   ]);
   console.log({ tickets: tickets.cache }) */

  await tickets.addCategory("duque", "duque", "duque", "duque");

  await tickets.addCategory("duque", "duque", "duque", "duque");

  await tickets.removeCategory("duque", "duque", "duque", "duque");

  console.log({ categories: guild.ticketsConfiguration.categories });

  const now = Date.now();
  console.log(`It took`, chalk.bgRed(`${now - before}ms`), "to fetch all data.");
});