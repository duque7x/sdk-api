const Routes = require("../rest/Routes");
const assert = require('node:assert');

exports.BetUser = class {
  #rest;
  #data;
  /**
   * 
   * @param {*} data 
   */
  constructor(data, rest, guildId) {
    this.id = data?.id ?? "";
    this.name = data?.name ?? "";
    this.credit = Number(data?.credit) ?? 0;
    this.wins = Number(data?.wins) ?? 0;
    this.mvps = Number(data?.mvps) ?? 0;
    this.losses = Number(data?.losses) ?? 0;
    this.betsPlayed = data?.betsPlayed ?? [];
    this.blacklist = data?.blacklist ?? false;
    this.createdAt = new Date(data.createdAt) ?? new Date();
    this.updatedAt = new Date(data.updatedAt) ?? new Date();

    this.coins = data?.coins ? Number(data?.coins) : 0;
    this.dailyWins = data?.dailyWins ?? { amount: 0, date: new Date() };

    this.#rest = rest;
    this.#data = data;

    this.guildId = guildId ?? "";
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
  async add(field, amount) {
    assert(field && typeof field === "string", "Field must be a string");
    assert(amount, "Amount must be present");

    const route = Routes.guilds.betUsers.resource(this.id, field, this.guildId);
    const payload = { id: this.id, name: this.name, [field]: amount, guildId: this.guildId };
    const updatedData = await this.#rest.request("PATCH", route, payload);

    this.#updateInternals(updatedData);
    return updatedData[field];
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
    } else {
      finalPayload = { ...payload };
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
      if (this[key]) this[key] = data[key];
    }
  }
}