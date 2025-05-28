
const { REST } = require("../index.js");
const client = new REST();

client.init().then(async (_) => {
    const guild = client.guilds.cache.get("1341399030282059776");
    await guild.add("betsChannels", {
        type: "1v1",
        id: "1212"
    });

    console.log({
        guildChannels: guild.betsChannels
    });
});

process.on('warning', (warning) => {
    console.warn(warning.name);    // e.g. 'Warning'
    console.warn(warning.message); // e.g. 'Accessing non-existent property...'
    console.warn(warning.stack);   // Full stack trace
});