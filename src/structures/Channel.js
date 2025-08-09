/* eslint-disable no-unused-private-class-members */
const assert = require("node:assert");

exports.Channel = class {
    #field;
    #rest;
    #guildId;
    constructor(data, rest) {
        this.baseUrl = data?.baseUrl;

        this.id = data?.id;
        this.type = data?.type;
        this.manager = data?.manager;
        this.baseUrl = data?.baseUrl;

        this.#guildId = data?.guildId;
        this.#rest = rest;
    }
    toString() {
        return `<#${this.id}>`;
    }
    async setId(id) {
        assert(id && typeof id == "string", "Channel id must be a string");

        const payload = { id };
        const response = await this.#rest.request("PATCH", this.baseUrl, payload);
        this.#update(response);
        return this;
    }
    async delete() {
        const response = await this.#rest.request("delete", this.baseUrl);
        this.#update(response);
        return this;
    }
    #update(data) {
        if (data.channels) {
            const ch = data.channels.find(c => c.type == this.type);
            this.id = ch.id;
            this.manager.set(ch.type, ch);
        } else {
            this.id = data.id;
            this.manager.set(data.type, data);
        }
        
        return this;
    }
}