const Routes = require("../rest/Routes");
const assert = require('node:assert');

exports.Mediator = class {
    #rest;
    #data;
    constructor(data, rest, guildId, manager) {
        this.manager = manager;
        
        this.id = data?.id;
        this.name = data?.name;
        this.paymentLinks = data.paymentLinks;
        this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
        this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();

        this.#rest = rest;
        this.#data = data;
        this.guildId = guildId;
    }
    get data() {
        return this.#data;
    }
    async delete() {
        const route = Routes.guilds.mediators.delete(this.id, this.guildId);
        const updatedData = await this.#rest.request("DELETE", route);
        this.#updateInternals(updatedData);
        return;
    };
    async setLinks(link) {
        assert(link && typeof link === "string", "Link must be a string");

        const route = Routes.guilds.mediators.resource(this.guildId, this.id, "links");
        const payload = { paymentLinks: [link], set: true };
        const updatedData = await this.#rest.request("PATCH", route, payload);

        this.#updateInternals(updatedData);
        return this.paymentLinks;
    };
    async removeLink(link) {
        assert(link && typeof link === "string", "Link must be a string");
        const route = Routes.guilds.mediators.resource(this.guildId, this.id, "links");

        const payload = { paymentLinks: this.paymentLinks.filter(lm => lm !== link) };
        const updatedData = await this.#rest.request("PATCH", route, payload);

        this.#updateInternals(updatedData);
        return this.paymentLinks;
    };
    #updateInternals(data) {
        for (let key in data) {
            if (key == "id" || key == "_id" || key == "guildId") continue;
            if (this[key]) this[key] = data[key];
        }

        this.manager.set(data.id, data);
    }
    toString() {
        return `<@${this.id}>`;
    }
}
