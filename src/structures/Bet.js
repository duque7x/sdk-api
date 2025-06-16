const Routes = require("../rest/Routes");
const assert = require("node:assert");

class Bet {
    #rest;
    #data;
    /**
     * 
     * @param {*} data 
     * @param {import("../rest/REST").REST} rest
     */
    constructor(data, rest, guildId) {
        this.players = data?.players ?? [];
        this.price = data?.price ?? 1;
        this.payedBy = data?.payedBy ?? [];
        this.createdAt = new Date(data.createdAt) ?? new Date();
        this.updatedAt = new Date(data.updatedAt) ?? new Date();

        this.channels = data?.channels ?? [];
        this.winner = data?.winner ?? "";
        this.loser = data?.loser ?? "";

        this.type = data?.type ?? "4v4";
        this.status = data?.status ?? "created";
        this.maximumSize = data?.maximumSize ?? 2;
        this.teamA = data?.teamA ?? [];
        this.teamB = data?.teamB ?? [];
        this.creatorId = data?.creatorId ?? "";
        this.embedMessageId = data?.embedMessageId ?? "";
        this.mediatorId = data?.mediatorId ?? "";
        this.confirmed = data?.confirmed ?? [];
        this.messages = data?.messages ?? [];
        this._id = data?._id;

        this.#rest = rest;
        this.#data = data;
        this.guildId = guildId;
    }
    get data() {
        return this.#data;
    }
    async delete() {
        const route = Routes.guilds.bets.delete(this._id, this.guildId);
        await this.#rest.request("DELETE", route);
        return;
    };
    async add(field, amount) {
        const route = Routes.guilds.bets.resource(this.guildId, this._id, field.toLowerCase());
        if (field === "channels") {
            const payload = { channel: amount };
            const updatedData = await this.#rest.request("PATCH", route, payload);

            this.#updateInternals(updatedData);
            return updatedData["channels"];
        }
        const updatedData = await this.#rest.request("PATCH", route, { [field]: amount });
        this.#updateInternals(updatedData);
        return updatedData[field];
    };

    async addConfirmed(type, id) {
        assert(type && typeof type === "string", "Type must be a string");
        assert(id && typeof id === "string", "Value must be present");

        const payload = { entry: { type, id } };
        const route = Routes.guilds.bets.resource(this.guildId, this._id, "confirmed");
        const updatedData = await this.#rest.request("PATCH", route, payload);

        this.#updateInternals(updatedData);
        return this.confirmed.find(cn => cn.type == type);
    }
    async setConfirmed(set) {
        assert(set && typeof set === "object", "Set must be an object");

        const route = Routes.guilds.bets.resource(this.guildId, this._id, "confirmed");
        const updatedData = await this.#rest.request("PATCH", route, set);
        this.#updateInternals(updatedData);
        return this.confirmed;
    }

    async setStatus(status) {
        assert(status && typeof status === "string", "Status must be a string or type STATES");
        assert(["off", "on", "created", "shutted", "waiting"].includes(status), "Status not available");

        const payload = { set: status };
        const route = Routes.guilds.bets.resource(this.guildId, this._id, "status");
        const updatedData = await this.#rest.request("PATCH", route, payload);

        this.#updateInternals(updatedData);
        return updatedData.status;
    }
    async setWinner(userId) {
        assert(userId && typeof userId === "string", "UserId must be a string");

        const payload = { set: userId };
        const route = Routes.guilds.bets.resource(this.guildId, this._id, "winner");
        const updatedData = await this.#rest.request("PATCH", route, payload);

        this.#updateInternals(updatedData);
        return updatedData.winner;
    }
    async setLoser(userId) {
        assert(userId && typeof userId === "string", "UserId must be a string");

        const payload = { set: userId };
        const route = Routes.guilds.bets.resource(this.guildId, this._id, "loser");
        const updatedData = await this.#rest.request("PATCH", route, payload);

        this.#updateInternals(updatedData);
        return updatedData.loser;
    }
    async remove(field, amount) {
        const route = Routes.guilds.bets.resource(this.guildId, this._id, field.toLowerCase());
        const updatedData = await this.#rest.request(
            "PATCH",
            route,
            { [field]: -amount }
        );

        this.#updateInternals(updatedData);
        return this;
    };
    async addChannel(payload) {
        assert(payload && typeof payload === "object", "Key must be an object");
        assert(payload.id, "Channel.id must be present");
        assert(payload.type, "Channel.type must be present");

        const route = Routes.guilds.bets.resource(this.guildId, this._id, "channels");
        const updatedData = await this.#rest.request("PATCH", route, payload);
        this.#updateInternals(updatedData);
        return updatedData.channels.find(cn => cn.type == payload.type);
    }
    async addMessage(payload) {
        assert(payload && typeof payload === "object", "Key must be an object");
        assert(payload.id, "Message.id must be present");
        assert(payload.type, "Message.type must be present");

        const route = Routes.guilds.bets.resource(this.guildId, this._id, "messages");
        const updatedData = await this.#rest.request("PATCH", route, payload);
        this.#updateInternals(updatedData);

        return updatedData.messages.find(msg => msg.type == payload.type);
    }
    async setChannels(channels) {
        assert(payload && typeof payload === "object", "Key must be an object");

        const payload = { set: channels };
        const route = Routes.guilds.bets.resource(this.guildId, this._id, "channels");
        const updatedData = await this.#rest.request("PATCH", route, payload);

        this.#updateInternals(updatedData);
        return updatedData["channels"];
    }

    async set(key, value) {
        assert(key && typeof key === "string", "Key must be a string");
        assert(value, "Value must be present");

        const route = Routes.guilds.bets.resource(this.guildId, this._id, key.toLowerCase());

        if (key === "confirmed") {
            assert(value && typeof value === "object", "Value must be an object");
            assert(value.id && typeof value.id === "string", "Value id must be a string");
            assert(value.type && typeof value.type === "string", "Payload must include a type");

            const payload = { entry: { type: value.type, id: value.id } };
            const updatedData = await this.#rest.request("POST", route, payload);
            this.#updateInternals(updatedData);

            return updatedData.confirmed.find(cn => cn.type == value.type);
        }
        const payload = { set: value };
        const updatedData = await this.#rest.request("PATCH", route, payload);
        this.#updateInternals(updatedData);
        return this;
    };
    async addPlayer(payload) {
        assert(payload && typeof payload === "object", "Payload must be an object");
        assert(payload.id && typeof payload.id === "string", "Payload id must be a string");
        assert(payload.name && typeof payload.name === "string", "Payload must include name");
        payload.guildId = this.guildId;

        const route = Routes.guilds.bets.resource(this.guildId, this._id, "players");
        const updatedData = await this.#rest.request("POST", route, payload);

        this.#updateInternals(updatedData);
        return updatedData.players;
    }
    async removePlayer(payload) {
        assert(payload && typeof payload === "object", "Payload must be an object");
        assert(payload.id && typeof payload.id === "string", "Payload id must be a string");
        assert(payload.name && typeof payload.name === "string", "Payload must include name");
        payload.guildId = this.guildId;
        payload.betId = this._id;

        const route = Routes.guilds.bets.resource(this.guildId, this._id, "players", payload.id);
        const updatedData = await this.#rest.request("DELETE", route, payload);
        this.#updateInternals(updatedData);
        return updatedData.players;
    }
    #updateInternals(data) {
        for (let key in data) {
            if (key == "id" || key == "_id" || key == "guildId") continue;
            if (this[key]) this[key] = data[key];
        }
    }
}
module.exports = { Bet };