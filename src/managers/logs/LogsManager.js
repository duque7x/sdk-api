const Routes = require("../../rest/Routes");
const assert = require("node:assert");
const { Collection } = require("../../structures/Collection");

exports.LogsManager = class {
    #logs;
    #rest;
    #baseUrl;
    constructor(data, rest) {
        let { guildId, _id } = data;

        this.#logs = data;
        this.#rest = rest;

        this.guildId = guildId;
        this.#baseUrl = Routes.guilds.bets.resource(this.guildId, _id, "logs");

        this.messages = new Collection();
        this.#updateMessagesInternaly(data.messages);
    }
    async addMessage(content, type, userId) {
        assert(content && typeof content === "string" || typeof content === "object", "Content must be a string");
        assert(type && typeof type === "string", "Type must be present");
        assert(userId && typeof userId === "string", "User Id must be present");

        const payload = { content, type, userId };
        const route = Routes.fields(this.#baseUrl, "messages");
        const updatedData = await this.#rest.request("PATCH", route, payload);

        this.#updateMessagesInternaly(updatedData.logs.messages);
        return updatedData.messages;
    }
    #updateMessagesInternaly(messages) {
        if (typeof messages === "object") {
            this.messages.clear();
            for (let msg of messages) {
                this.messages.set(`${msg.userId}-${new Date(msg.createdAt).getTime()}`, {
                    content: msg.content ?? "",
                    userId: msg.userId ?? 0,
                    type: msg.type ?? "text",
                    createdAt: new Date(msg.createdAt) ?? new Date()
                });
            }
        };
    }
}