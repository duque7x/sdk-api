/* eslint-disable no-unused-private-class-members */
const Routes = require("../../rest/Routes");
const assert = require("node:assert");
const { Collection } = require("../../structures/Collection");

exports.LogsManager = class {
    #logs;
    #rest;
    #baseUrl;
    constructor(data, rest) {
        let { guildId, baseUrl } = data;

        this.#logs = data;
        this.#rest = rest;

        this.guildId = guildId;
        this.#baseUrl = baseUrl;

        this.messages = new Collection();
        this.#updateMessages(data?.messages);
    }
    async addMessage(content, id, type) {
        content = this.resolveContent(content);
        type = this.resolveType(type);

        assert(content && typeof content === "string", "Content must be a string");
        assert(id && typeof id === "string", "User Id must be present");

        const payload = { type, userId: id, content };
        const route = Routes.fields(this.#baseUrl, "messages");
        const response = await this.#rest.request("POST", route, payload);

        this.#updateMessages(response);
        return this.messages;
    }
    resolveContent(content) {
        if (!content) return null;
        if (typeof content === "string") return content;
        if (typeof content === "object") return String(content.toString());
    }
    resolveType(type) {
        if (!type) type = 'txt';
        if (typeof type !== "string") type = String(type);
        return type;
    }
    #updateMessages(messages) {
        if (typeof messages === "object") {
            this.messages.clear();
            for (let msg of messages || []) {
                this.messages.set(`${msg.userId}-${new Date(msg.createdAt).getTime()}`, {
                    content: msg.content ?? "",
                    userId: msg.userId ?? 0,
                    type: msg.type ?? "text",
                    createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date()
                });
            }
        };
    }

}