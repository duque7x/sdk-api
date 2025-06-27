const Routes = require("../rest/Routes");


class Match {
    #rest;
    #data;
    /**
     * 
     * @param {*} data 
     */
    constructor(data, rest, guildId, manager) {
        this.manager = manager;

        this.type = data?.type;
        this.voiceChannels = data?.voiceChannels;
        this.status = data?.status;
        this.creatorId = data?.creatorId;
        this.players = data?.players;
        this.kickedOut = data?.kickedOut;

        this.maximumSize = Number(data?.maximumSize) || 2;
        this.teamA = data?.teamA;
        this.teamB = data?.teamB;
        this.confirmed = data?.confirmed;
        this.leaders = data?.leaders;
        this._id = data?._id;
        this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
        this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();
        this.#data = data;
        this.#rest = rest;

        this.guildId = guildId;
    }
    toString() {
        return `${this._id}`;
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
                    Routes.fields(Routes.fields(route, op.toLowerCase()))
                );
                this[op] = options[op];
            }
            return this;
        }
        if (typeof key !== "string") throw new Error("key must be a string");
        const route = Routes.guilds.matches.resource(this._id, key.toLowerCase(), this.guildId);
        const updatedData = await this.#rest.request("DELETE", route);
        this.#updateInternals(updatedData);

        return this;
    };
    async delete() {
        const route = Routes.guilds.matches.delete(this._id, this.guildId);
        const updatedData = await this.#rest.request("DELETE", route);
        this.#updateInternals(updatedData);
        return;
    };
    async setStatus(status) {
        const route = Routes.guilds.matches.resource(this._id, "status", this.guildId);
        const updatedData = await this.#rest.request("PATCH", route, { status });

        this.#updateInternals(updatedData);
        return this;
    }

    async addPlayer(id, name) {
        if (!id) throw new Error("no id was provided");
        const route = Routes.guilds.matches.resource(this._id, "players", this.guildId);
        const updatedData = await this.#rest.request("POST", route, { id, name });

        this.#updateInternals(updatedData);
        return this;
    }
    async removePlayer(id) {
        if (!id) throw new Error("no id was provided");

        const route = Routes.fields(Routes.guilds.matches.resource(this._id, "players", this.guildId), id)
        const updatedData = await this.#rest.request("DELETE", route, { id });

        this.#updateInternals(updatedData);
        return this;
    }
    #updateInternals(data) {
        for (let key in data) {
            if (key == "id" || key == "_id" || key == "guildId") continue;
            if (this[key]) this[key] = data[key];
        }
        this.manager.set(this._id, this);
    }
}

module.exports = { Match };