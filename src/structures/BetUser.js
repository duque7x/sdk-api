const Routes = require("../rest/Routes");
const assert = require('node:assert');

exports.BetUser = class {
  #rest;
  #data;
  /**
   * 
   * @param {*} data 
   */
  constructor(data, rest, guildId, manager) {
    this.guildId = guildId || "";

    this.daily = data?.daily;

    this.manager = manager;

    this.id = data?.id || "";
    this.name = data?.name || "";
    this.credit = data?.credit ? Number(data?.credit) : 0;
    this.wins = data?.wins ? Number(data?.wins) : 0;
    this.mvps = data?.mvps ? Number(data?.mvps) : 0;
    this.losses = data?.losses ? Number(data?.losses) : 0;
    this.betsPlayed = data?.betsPlayed || [];
    this.blacklist = data?.blacklist || false;
    this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
    this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();
    this.items = data?.items || [];

    this.coins = data?.coins ? Number(data?.coins) : 0;
    this.profileCard = data?.profileCard ? data.profileCard : { description: "Use o botão abaixo para alterar a sua bio.", banner: { equipped: 1, allowed: [1] } };

    this.#rest = rest;
    this.#data = data;

  }
  toString() {
    return `<@${this.id}>`;
  }
  get data() {
    return this.#data;
  }
  async delete() {
    const route = Routes.guilds.betUsers.delete(this.id, this.guildId);
    const payload = { id: this.id, name: this.name, guildId: this.guildId };

    const updatedData = await this.#rest.request("DELETE", route, payload);
    this.#updateInternals(updatedData);
    return;
  };
  async setBlacklist(value) {
    assert(value !== undefined && typeof value === "boolean", "Value must be a boolean");

    const route = Routes.guilds.betUsers.resource(this.id, "blacklist", this.guildId);
    const payload = { value, name: this.name };
    const updatedData = await this.#rest.request("PATCH", route, payload);

    this.#updateInternals(updatedData);
    return this;
  }
  async setDescription(description) {
    assert(description && typeof description === "string", "Description must be a string");

    const route = Routes.guilds.betUsers.resource(this.id, "description", this.guildId);
    const payload = { description };
    const updatedData = await this.#rest.request("PATCH", route, payload);

    this.#updateInternals(updatedData);
    return this;
  }
  async setBanner(banner) {
    assert(typeof banner === "number", "BannerId must be a number");

    const route = Routes.guilds.betUsers.resource(this.id, "banner", this.guildId);
    const payload = { bannerId: banner };
    const updatedData = await this.#rest.request("PATCH", route, payload);

    this.#updateInternals(updatedData);
    return this;
  }
  async add(field, amount) {
    assert(field && typeof field === "string", "Field must be a string");
    assert(amount, "Amount must be present");

    const route = Routes.guilds.betUsers.resource(this.id, field, this.guildId);
    const payload = { id: this.id, name: this.name, [field]: amount, guildId: this.guildId };
    const updatedData = await this.#rest.request("PATCH", route, payload);

    this.#updateInternals(updatedData);
    return this;
  };
  async remove(field, amount) {
    assert(field && typeof field === "string", "Field must be a string");
    assert(amount, "Amount must be present");

    const route = Routes.guilds.betUsers.resource(this.id, field, this.guildId);
    const payload = { id: this.id, name: this.name, [field]: -amount, guildId: this.guildId };
    const updatedData = await this.#rest.request("PATCH", route, payload);
    this.#updateInternals(updatedData);
    return this;
  };
  async set(key, value) {
    assert(key && typeof key === "string", "Key must be a string");
    assert(value, "Value must be present");

    const route = Routes.guilds.betUsers.resource(this.id, key.toLowerCase(), this.guildId);
    const payload = { id: this.id, name: this.name, set: value, guildId: this.guildId };
    const updatedData = await this.#rest.request("PATCH", route, payload);
    this.#updateInternals(updatedData);
    return this;
  };
  async update(payload) {
    assert(payload && typeof payload === "object", "Payload must be an object");
    let finalPayload = {};

    if (payload.type == "add") {
      for (let key in payload) {
        if (key === "type") continue; // Skip type

        if (key == "losses") finalPayload.losses = Math.max(0, this.losses + payload.losses);
        if (key == "wins") finalPayload.wins = Math.max(0, this.wins + payload.wins);
        if (key == "mvps") finalPayload.mvps = Math.max(0, this.mvps + payload.mvps);
        if (key == "credit") finalPayload.credit = Math.max(0, this.credit + payload.credit);
        if (key == "coins") finalPayload.coins = Math.max(0, this.coins + payload.coins);

        if (key == "betsPlayed") {
          finalPayload.betsPlayed = [...this.betsPlayed]; // Start with existing bets
          for (let bet of payload.betsPlayed) {
            if (!finalPayload.betsPlayed.includes(bet)) {
              finalPayload.betsPlayed.push(bet); // Add only if not present
            }
          }
        }
      }
    } else if (payload.type == "remove") {
      for (let key in payload) {
        if (key === "type") continue; // Skip type

        if (key == "losses") finalPayload.losses = Math.max(0, this.losses - payload.losses);
        if (key == "wins") finalPayload.wins = Math.max(0, this.wins - payload.wins);
        if (key == "mvps") finalPayload.mvps = Math.max(0, this.mvps - payload.mvps);
        if (key == "credit") finalPayload.credit = Math.max(0, this.credit - payload.credit);
        if (key == "coins") finalPayload.coins = Math.max(0, this.coins - payload.coins);

        if (key == "betsPlayed") {
          finalPayload.betsPlayed = [...this.betsPlayed];
          for (let bet of payload.betsPlayed) {
            finalPayload.betsPlayed = finalPayload.betsPlayed.filter(id => id != bet);
          }
        }
      }
    }

    const route = Routes.guilds.betUsers.update(this.id, this.guildId);
    const updatedData = await this.#rest.request("PATCH", route, finalPayload);

    this.#updateInternals(updatedData);
    return this;
  }
  async reset(key) {
    const keyMaps = { wins: 0, losses: 0, mvps: 0, betsPlayed: [], credit: 0, blacklist: false, coins: 0 };
    if (!key) return await this.update(keyMaps);

    const payload = { [key]: keyMaps[key] };
    const route = Routes.guilds.betUsers.resource(this.id, key, this.guildId);
    const updatedData = await this.#rest.request("DELETE", route, payload);

    this.#updateInternals(updatedData);
    return this;
  }
  #updateInternals(data) {
    for (let key in data) {
      if (key == "id" || key == "_id" || key == "guildId") continue;
      if (key == "createdAt") this.createdAt = data[key] ? new Date(data[key]) : new Date();
      if (key == "updatedAt") this.updatedAt = data[key] ? new Date(data[key]) : new Date();
      
      if (this[key] !== undefined) this[key] = data[key];
    }
    this.manager.set(this.id, this);
  }
}