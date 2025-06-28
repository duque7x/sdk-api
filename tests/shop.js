/* eslint-disable no-unused-vars */
const { REST, STATES } = require("../index.js");
const client = new REST().setClientKey("877598927149490186");
const chalk = require("chalk");

client.init().then(async (_) => {
  const guild = client.guilds.cache.get("1336809872884371587");

  const before = Date.now();
  console.log(chalk.bgBlue(`Starting to fetch data....`));

  const shop = guild?.shop;

  const products = await shop.products.fetchAll();
  console.log({ products });

  const product = await shop.products.create({ name: "Duque", description: "The dque is the one", price: 20 });
  console.log({ product });

  await product.addBuyer("877598927149490186", "duque7x", "bet");
  await product.update({ description: "Netflix por 10€" })
  console.log({ product });
  console.log({ shop });


  const now = Date.now();
  console.log(`It took`, chalk.bgRed(`${now - before}ms`), "to fetch all data.");
});