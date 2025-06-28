const assert = require("node:assert");
const Routes = require("../rest/Routes");

exports.Channels = class {
    #field;
    #rest;
    #guildId;
    constructor(data, rest, field, guildId, manager) {
        this.ids = data?.ids || [];
        this.type = data?.type;

        this.#field = field;
        this.#rest = rest;
        this.#guildId = guildId;

        this.manager = manager;
    }
    toString() {
        return `${this.ids.length}`;
    }
    async addId(id) {
        assert(id && typeof id == "string", "Channel id must be a string");

        const payload = { id };
        const route = Routes.fields(Routes.guilds.resource(this.#field, this.#guildId), 'channels');
        const response = await this.#rest.request("POST", route, payload);
        this.#update(response);
        return this;
    }

    #update(data) {
        const ch = data.channels.find(c => c.type == this.#field);
        this.ids = ch.ids;
        return this;
    }
}