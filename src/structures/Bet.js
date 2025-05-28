const Routes = require("../rest/Routes");
const assert = require("node:assert");

class Bet {
    #rest;
    #data;
    /**
     * 
     * @param {*} data 
     */
    constructor(data, rest, guildId) {
        this.players = data?.players;
        this.price = data?.price;
        this.payedBy = data?.payedBy;
        this.createdAt = data?.createdAt;

        this.channels = {
            textChannel: data?.textChannel,
            waintingChannel: data?.waintingChannel,
        }
        this.type = data?.type;
        this.status = data?.status;
        this.winners = data?.winners;
        this.maximumSize = data?.maximumSize;
        this.teamA = data?.teamA;
        this.teamB = data?.teamB;
        this.creatorId = data?.creatorId;
        this.adminId = data?.adminId;
        this.confirmed = data?.confirmed;
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
            console.log({ field, amount });

            const payload = { channel: amount, guildId: this.guildId };
            const updatedField = await this.#rest.request("PATCH", route, payload);

            this[amount.type] = { id: updatedField.id };

            return updatedField;
        }
        const updatedField = await this.#rest.request("PATCH", route, { [field]: amount, guildId: this.guildId }
        );

        this[field] = updatedField;
        return this[field];
    };
    async remove(field, amount) {
        const route = Routes.guilds.bets.resource(this.guildId, this._id, field.toLowerCase());
        const updatedField = await this.#rest.request(
            "PATCH",
            route,
            { [field]: -amount, guildId: this.guildId }
        );

        this[field] = updatedField;
        return this;
    };
    async set(key, value) {
        assert(key && typeof key === "string", "Key must be a string");
        assert(value, "Value must be present");

        const route = Routes.guilds.bets.resource(this.guildId, this._id, key.toLowerCase());

        if (key === "confirmed") {
            assert(value && typeof value === "object", "Value must be an object");
            assert(value.id && typeof value.id === "string", "Value id must be a string");
            assert(value.type && typeof value.type === "string", "Payload must include a type");

            const payload = { entry: { type: value.type, id: value.id }, guildId: this.guildId };
            const updatedField = await this.#rest.request("POST", route, payload);
            this.confirmed = updatedField;
            console.log({  updatedField     });

            return this.confirmed;
        }
        const payload = { set: value, guildId: this.guildId };
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
