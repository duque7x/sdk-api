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
        this.createdAt = new Date(data.createdAt)?? new Date();
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
            const updatedField = await this.#rest.request("PATCH", route, payload);

            this.channels[amount.type] = { id: updatedField.id };

            return updatedField;
        }
        const updatedField = await this.#rest.request("PATCH", route, { [field]: amount }
        );

        this.channels[field] = updatedField;
        return this[field];
    };

    async addConfirmed(type, id) {
        assert(type && typeof type === "string", "Type must be a string");
        assert(id && typeof id === "string", "Value must be present");

        const payload = { entry: { type, id } };
        const route = Routes.guilds.bets.resource(this.guildId, this._id, "confirmed");
        const response = await this.#rest.request("PATCH", route, payload);

        const index = this.confirmed.findIndex(cn => cn.type === type);
        if (index !== -1) {
            this.confirmed[index] = { ...response };
        } else {
            this.confirmed.push({ ...response });
        }
        return this.confirmed.find(cn => cn.type == type);
    }
    async addConfrmed(set) {
        assert(set && typeof set === "object", "Set must be an object");

        const route = Routes.guilds.bets.resource(this.guildId, this._id, "confirmed");
        const response = await this.#rest.request("PATCH", route, set);
        this.confirmed = response;
        return this.confirmed;
    }

    async setStatus(status) {
        assert(status && typeof status === "string", "Status must be a string or type STATES");
        assert(["off", "on", "created", "shutted", "waiting"].includes(status), "Status not available");

        const payload = { set: status };
        const route = Routes.guilds.bets.resource(this.guildId, this._id, "status");
        const response = await this.#rest.request("PATCH", route, payload);

        this.status = response;
        return this.status;
    }
    async setWinner(userId) {
        assert(userId && typeof userId === "string", "UserId must be a string");

        const payload = { set: userId };
        const route = Routes.guilds.bets.resource(this.guildId, this._id, "winner");
        const response = await this.#rest.request("PATCH", route, payload);

        this.winner = response;
        return this.winner;
    }
    async setLoser(userId) {
        assert(userId && typeof userId === "string", "UserId must be a string");

        const payload = { set: userId };
        const route = Routes.guilds.bets.resource(this.guildId, this._id, "loser");
        const response = await this.#rest.request("PATCH", route, payload);

        this.loser = response;
        return this.loser;
    }
    async remove(field, amount) {
        const route = Routes.guilds.bets.resource(this.guildId, this._id, field.toLowerCase());
        const updatedField = await this.#rest.request(
            "PATCH",
            route,
            { [field]: -amount }
        );

        this[field] = updatedField;
        return this;
    };
    async addChannel(payload) {
        assert(payload && typeof payload === "object", "Key must be an object");
        assert(payload.id, "Channel.id must be present");
        assert(payload.type, "Channel.type must be present");

        const route = Routes.guilds.bets.resource(this.guildId, this._id, "channels");
        const response = await this.#rest.request("PATCH", route, payload);
        this.channels = response;
        return response;
    }
    async setChannels(channels) {
        assert(payload && typeof payload === "object", "Key must be an object");

        const payload = { set: channels };
        const route = Routes.guilds.bets.resource(this.guildId, this._id, "channels");
        const response = await this.#rest.request("PATCH", route, payload);

        this.channels = response;
        return response;
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
            const updatedField = await this.#rest.request("POST", route, payload);
            this.confirmed = updatedField;

            return this.confirmed;
        }
        const payload = { set: value };
        const updatedField = await this.#rest.request("PATCH", route, payload);
        this[key] = updatedField;
        return this;
    };
    async addPlayer(payload) {
        assert(payload && typeof payload === "object", "Payload must be an object");
        assert(payload.id && typeof payload.id === "string", "Payload id must be a string");
        assert(payload.name && typeof payload.name === "string", "Payload must include name");
        payload.guildId = this.guildId;

        const route = Routes.guilds.bets.resource(this.guildId, this._id, "players");
        const response = await this.#rest.request("POST", route, payload);

        this.players = response;
        return response;
    }
    async removePlayer(payload) {
        assert(payload && typeof payload === "object", "Payload must be an object");
        assert(payload.id && typeof payload.id === "string", "Payload id must be a string");
        assert(payload.name && typeof payload.name === "string", "Payload must include name");
        payload.guildId = this.guildId;
        payload.betId = this._id;

        const route = Routes.guilds.bets.resource(this.guildId, this._id, "players", payload.id);
        const response = await this.#rest.request("DELETE", route, payload);

        this.players = response;
        return response;
    }
}
module.exports = { Bet };
