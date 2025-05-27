# Rest

Rest is npm package made for a bet based bot

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
  const user = client.guilds.cache.at(0).users.cache.get("877598927149490186");
  console.log({ user });
});
```

> OR

```javascript
const { REST } = require("@duque.edits/rest");
const client = new REST();

// Always initiate as it caches users, guilds, bets, matches.
client.init().then(async () => {
  const user = await client.guilds.cache.at(0).betUsers.fetch("877598927149490186", "duque7x");
  console.log({ user });
});
```
## NPM package
You can find the link [here](https://www.npmjs.com/package/@duque.edits/rest).

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.
