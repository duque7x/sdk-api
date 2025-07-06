# Rest

> Focused on a local made api directed at: bets, matches.
> Use this as a base for a sdk.

## Installation

```bash
npm install @duque.edits/rest
```

## Usage

```javascript
const { REST } = require("@duque.edits/rest");
const client = new REST();

// Always initiate as it caches users, guilds, bets, matches.

client.init().then(async () => {
  const guild = client.guilds.cache.at("1336809872884371587");
  // In my API, using fetch will automatically create an user if he doesn't exist
  const user = guild.users.fetch("877598927149490186");
  console.log({ user });

  // Reseting users
  client.users.resetAll();
  // Or
  client.betUsers.resetAll();
});
```
## Update 2.1.0
### Shop is now available. How to use?
```js
client.init().then(async (_) => {
  const guild = client.guilds.cache.get("1336809872884371587");

  const shop = guild?.shop;
  const products = await shop.products.fetchAll();
  const product = await shop.products.create({ name: "Duque", description: "The duque is the one", price: 20 });

  await product.addBuyer("877598927149490186", "duque7x", "bet");
  await product.update({ description: "Netflix por 10€", name: "Duque ain't the one", price: 100 });

});
```

## Update 2.3.0
### Tickts is now available. How to use?
```js
client.init().then(async (_) => {
  const guild = client.guilds.cache.get("1336809872884371587");

  const { tickets } = guild;
  const ticket = await tickets.create("877598927149490186", "support");

  await Promise.all([
    await ticket.setAdminId("199992755886358528"),
    await ticket.setClosedById("199992755886358528"),
    await ticket.setCustomerRating(10),
    await ticket.setType("support"),
  ]);
});
```
## NPM package
You can find the link [here](https://www.npmjs.com/package/@duque.edits/rest).

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

Pull requests [here](https://github.com/duque7x/sdk-api/pulls).