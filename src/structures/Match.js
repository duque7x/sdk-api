const Routes = require("../rest/Routes");


class Match {
    #rest;
    #data;
    /**
     * 
     * @param {*} data 
     */
    constructor(data, rest, guildId) {
        this.type = data.type;
        this.voiceChannels = data.voiceChannels;
        this.status = data.status;
        this.creatorId = data.creatorId;
        this.players = data.players;
        this.kickedOut = data.kickedOut;
        this.teamA = data.teamA;
        this.teamB = data.teamB;
        this.confirmed = data.confirmed;
        this.leaders = data.leaders;
        this._id = data._id;
        this.#data = data;
        this.#rest = rest;

        this.guildId = guildId;
    }
    get data() {
        return this.#data;
    }
    async reset(key) {
        if (!key) {
            const options = {
                players: [],
                voiceChannels: [],
                kickedOut: [],
                teamA: [],
                teamB: [],
                confirmed: [],
                leaders: []
            };

            for (let op in options) {
                const route = Routes.guilds.matches.resource(this._id, op.toLowerCase(), this.guildId);
                await this.#rest.request(
                    "DELETE",
                    Routes.fields(Routes.fields(Routes.match(this._id), op.toLowerCase()))
                );
                this[op] = options[op];
            }
            return this;
        }
        if (typeof key !== "string") throw new Error("key must be a string");
        const route = Routes.guilds.matches.resource(this._id, key.toLowerCase(), this.guildId);
        const reset = await this.#rest.request("DELETE", route);
        this[key] = reset;

        return this;
    };
    async delete() {
        const route = Routes.guilds.matches.resource(this._id, key.toLowerCase(), this.guildId);
        await this.#rest.request("DELETE", route);
        return;
    };
    async addPlayer(id, name) {
        if (!id) throw new Error("no id was provided")
        const route = Routes.guilds.matches.resource(this._id, "players", this.guildId);
        const response = await this.#rest.request("post", route, { id, name });

        this.players = response;
        return;
    }
}

module.exports = { Match };