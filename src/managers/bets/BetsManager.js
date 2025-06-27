const { Collection } = require("../../structures/Collection");
const { Bet } = require("../../structures/Bet");
const Routes = require("../../rest/Routes");
const assert = require("node:assert");

exports.BetsManager = class {
    #bets;
    #rest;
    /**
     * 
     * @param {import("../../../types/src/rest/REST").REST} rest 
     * @param {string} guildId 
     */
    constructor(data, rest) {
        this.#rest = rest;
        this.#bets = new Collection();

        this.guildId = data?.guildId;
        this.#updateBets(data?.bets);
    }
    get cache() {
        return this.#bets;
    }
    set(id, bet) {
        assert(id && typeof id === "string", `${id} must be a string or a Discord Snowflake`);
        return this.#set(bet);
    }
    async fetch(id) {
        assert(id && typeof id === "string", `${id} must be a string or a Mongoose Object Id`);

        const route = Routes.guilds.bets.get(id, this.guildId);
        const payload = { guildId: this.guildId };
        const response = await this.#rest.request("GET", route, payload)
        return this.#set(response);
    };
    async fetchAll() {
        const route = Routes.guilds.bets.getAll(this.guildId);
        const response = await this.#rest.request("GET", route);

        for (let betData of response) {
            this.#set(betData);
        }
        return this.#bets;
    };
    async create(payload) {
        assert(payload && typeof payload === "object", "Payload must be an object");
        assert(payload.type && typeof payload.type === "string", "Payload type must be an element of BETTYPES");
        assert(payload.creatorId && typeof payload.creatorId === "string", "Payload  must include creatorId");
        assert(payload.price && typeof payload.price === "number", "Payload  must include creatorId");

        const route = Routes.guilds.bets.create(this.guildId);
        const response = await this.#rest.request('POST', route, payload);
        const bet = this.#set(response);

        this.#rest.emit("betCreate", bet);
        return bet;
    }
    async delete(id) {
        assert(id && typeof id === "string", "Id must be a Mongoose Object Id");

        const route = Routes.guilds.bets.delete(id, this.guildId);
        const bet = this.#bets.get(id);
        this.#rest.emit("betDelete", bet);
        await this.#rest.request("DELETE", route, { guildId: this.guildId });

        this.#remove(id);
        return;
    };
    async deleteAll() {
        const route = Routes.guilds.bets.deleteAll(this.guildId);
        this.#rest.emit("betsDelete", this.#bets);
        const value = await this.#rest.request("DELETE", route, { guildId: this.guildId });
        this.#bets.clear();
        return value;
    };
    #remove(id) {
        this.#bets.delete(id);
    }
    #set(bet) {
        bet = bet instanceof Bet ? bet : new Bet(bet, this.#rest, this.guildId, this);
        this.#bets.set(bet._id, bet);
        this.#rest.bets.set(bet._id, bet);
        return bet;
    }
    #updateBets(data) {
        for (let bet of data ?? []) this.#set(bet);
    }
}