
const { REST } = require("../index.js");
const client = new REST().setClientKey("877598927149490186");;

client.init().then(async () => {
    try {
        //const guild = client.guilds.cache.get("1341399030282059776");


        //const match = await guild.matches.create({ creatorId: "877598927149490186", type: MATCHTYPES.FourVFour })
    } catch (error) {
        console.error(error);
    }
});
