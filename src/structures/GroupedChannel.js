const assert = require("node:assert");
const Routes = require("../rest/Routes");

exports.GroupedChannel = class {
    #rest;
    constructor(data, rest) {
        this.ids = data?.ids || [];
        this.type = data?.type;
        this.guild = data?.guild;
        this.baseUrl = Routes.fields(data?.baseUrl, data?.type);
        this.manager = data?.manager;

        this.#rest = rest;
    }
    toString() {
        return `${this.ids.length}`;
    }
    async fetch() {
        const route = this.baseUrl;
        const response = await this.#rest.request("GET", route);
        this.#update(response);
        return this;
    }
    async setIds(ids) {
        assert(ids && Array.isArray(ids), "Ids must be an array");

        const payload = { ids };
        const route = Routes.fields(this.baseUrl, "ids");
        const response = await this.#rest.request("PUT", route, payload);
        this.#update(response);
        return this;
    }
    async addId(id) {
        assert(id && typeof id == "string", "Channel id must be a string");

        const payload = { id };
        const route = Routes.fields(this.baseUrl, "ids");
        const response = await this.#rest.request("POST", route, payload);
        this.#update(response);
        return this;
    }

    async removeId(id) {
        assert(id && typeof id == "string", "Channel id must be a string");

        const payload = { id };
        const route = Routes.fields(this.baseUrl, "ids", id);
        const response = await this.#rest.request("DELETE", route, payload);
        this.#update(response);
        return this;
    }

    #update(data) {
        for (let key in data) {
            if (key == "id") continue;
            if (this[key]) this[key] = data[key];
        }
        return this;
    }
}