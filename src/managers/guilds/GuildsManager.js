const { Collection } = require("../../structures/Collection");
const { Guild } = require("../../structures/Guild");
const Routes = require("../../rest/Routes");
const assert = require("node:assert");

exports.GuildsManager = class GuildsManager {
    #guilds;
    #rest;

    constructor(rest) {
        this.#rest = rest;
        this.#guilds = new Collection();
    }

    get cache() {
        return this.#guilds;
    }

    set(id, guild) {
        assert(id && typeof id === "string", `${id} must be a string or a Discord Snowflake`);
        assert(guild instanceof Guild, `${guild} must be an instance of Guild`);

        this.#guilds.set(id, guild);
        return guild;
    }

    async fetch(id) {
        assert(id && typeof id === "string", `${id} must be a string or a Discord Snowflake`);
        const route = Routes.guilds.get(id);
        const response = await this.#rest.request("GET", route);

        const guild = new Guild(response, this.#rest);

        this.set(guild.id, guild);
        return guild;
    }

    async fetchAll() {
        const route = Routes.guilds.getAll();
        const response = await this.#rest.request("GET", route);

        this.#guilds.clear();
        for (const guildData of response) {
            const guild = new Guild(guildData, this.#rest);
            this.set(guildData.id, guild);
        }

        return this.#guilds;
    }

    async create(payload) {
        assert(payload && typeof payload === "object", "Payload must be an object");
        assert(typeof payload.id === "string", "Payload id must be a string");
        assert(typeof payload.name === "string", "Payload must include a name");

        const route = Routes.guilds.create();
        const response = await this.#rest.request("POST", route, payload);

        if (!response || !response.id) throw new Error("Failed to create guild - invalid response");

        const guild = new Guild(response, this.#rest);
        this.set(guild.id, guild);

        this.#rest.emit("guildCreate", guild);
        return guild;
    }

    async delete(id) {
        assert(id && typeof id === "string", `${id} must be a string or a Discord Snowflake`);

        const route = Routes.guilds.get(id);
        await this.#rest.request("DELETE", route);

        const guild = this.#guilds.get(id);
        if (guild) this.#rest.emit("guildDelete", guild);

        this.#guilds.delete(id);
    }

    async deleteAll() {
        const route = Routes.guilds.getAll();
        await this.#rest.request("DELETE", route);

        this.#rest.emit("guildsDelete", this.#guilds);
        this.#guilds.clear();
    }

    async cacheGuilds() {
        const ONE_MINUTE = 1 * 60 * 1000;

        const requestGuilds = async () => {
            const route = Routes.guilds.getAll();
            const guilds = await this.#rest.request("GET", route);
            if (!guilds || guilds.error) return new Collection();

            for (const guildData of guilds) {
                if (!guildData.id) continue;
                const guild = new Guild(guildData, this.#rest);
                this.set(guild.id, guild);
            }
        };

        setInterval(() => requestGuilds().catch(console.error), ONE_MINUTE);
        await requestGuilds().catch(console.error);
        return this.#guilds;
    }
};
