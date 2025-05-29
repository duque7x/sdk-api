const Routes = require("../rest/Routes");
const assert = require('node:assert');

exports.Mediator = class {
    #rest;
    #data;
    constructor(data, rest, guildId) {
        this.id = data?.id;
        this.name = data?.name;
        this.paymentLinks = data.paymentLinks;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = new Date(data.updatedAt);

        this.#rest = rest;
        this.#data = data;
        this.guildId = guildId;
    }
    get data() {
        return this.#data;
    }
    async delete() {
        const route = Routes.guilds.mediators.delete(this.id, this.guildId);
        return await this.#rest.request("DELETE", route);
    };
    async setLinks(link) {
        assert(link && typeof link === "string", "Link must be a string");

        const route = Routes.guilds.mediators.resource(this.guildId, this.id, "links");
        const payload = { paymentLinks: [link] };
        const updatedField = await this.#rest.request("PATCH", route, payload);

        this.paymentLinks = updatedField;
        return this.paymentLinks;
    };
    async removeLink(link) {
        assert(link && typeof link === "string", "Link must be a string");
        const route = Routes.guilds.mediators.resource(this.guildId, this.id, "links");

        const payload = { paymentLinks: this.paymentLinks.filter(lm => lm !== link) };
        const updatedField = await this.#rest.request("PATCH", route, payload);

        this.paymentLinks = updatedField;
        return this.paymentLinks;
    };
}
