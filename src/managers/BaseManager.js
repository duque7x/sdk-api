const Routes = require("../rest/Routes");
const { assertString } = require("../structures/Assertions");
const { Collection } = require("../structures/Collection");
exports.BaseManager = class {
    #manager;
    constructor(data, rest, manager) {
        this.data = data?.data;
        this.baseUrl = data?.baseUrl;
        this.guild = data?.guild;
        this.cache = new Collection(data.data);

        this.rest = rest;
        this.#manager = manager;
    }
    async fetch(id) {
        assertString(id);

        const route = Routes.fields(this.baseUrl, id);
        const response = await this.rest.request('GET', route);
        const managerData = { data: response, baseUrl: route, guild: this.guild, manager: this.#manager };
        return new this.#manager.child(managerData, this.rest);
    }
    async fetchAll() {
        const response = await this.rest.request('GET', this.baseUrl);
        const managerData = { data: response, baseUrl: this.baseUrl, guild: this.guild };
        return new this.#manager(managerData, this.rest);
    }
    toJSON() {
        return this.cache.toJSON();
    }
    toArray() {
        return this.cache.toArray();
    }
}