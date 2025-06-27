const Routes = require("../rest/Routes");
const assert = require('node:assert');

class User {
  #rest;
  #data;
  /**
   * 
   * @param {*} data 
   */
  constructor(data, rest, guildId, manager) {
    this.manager = manager;

    this.id = data.id;
    this.name = data.name;
    this.points = data.points;
    this.wins = data.wins;
    this.mvps = data.mvps;
    this.losses = data.losses;
    this.gamesPlayed = data.gamesPlayed;
    this.blacklist = data.blacklist;
    this.protections = data.protections;
    this.originalChannels = data.originalChannels;
    this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
    this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();
    this.#rest = rest;
    this.#data = data;

    this.guildId = guildId;
  }
  get data() {
    return this.#data;
  }
  async reset(key) {
    if (!key) {
      const options = {
        wins: 0,
        points: 0,
        losses: 0,
        mvps: 0,
        gamesPlayed: [],
        protections: [],
        originalChannels: [],
        blacklist: { blacklisted: false },
      };
      const route = Routes.guilds.users.resource(this.id, this.guildId);
      const updatedData = await this.#rest.request("PATCH", route, options);
      this.#updateInternals(updatedData);
      return this;
    }
    if (typeof key !== "string") throw new Error("key must be a string");
    const route = Routes.guilds.users.resource(this.id, key.toLowerCase(), this.guildId);
    const updatedData = await this.#rest.request("DELETE", route);
    this.#updateInternals(updatedData);

    return this;
  };
  async delete() {
    const route = Routes.guilds.users.delete(this.id, this.guildId);
    await this.#rest.request("delete", route);
    return;
  };
  async add(field, amount = 1) {
    assert(field && typeof field == "string", "Field must be a string");
    assert(amount, "Amount must be present");

    const route = Routes.guilds.users.resource(this.id, field, this.guildId);
    const updatedData = await this.#rest.request("PATCH", route, { [field]: amount });

    this.#updateInternals(updatedData);
    return this[field];
  };
  async remove(field, amount = 1) {
    assert(field && typeof field == "string", "Field must be a string");
    assert(amount, "Amount must be present");

    const route = Routes.guilds.users.resource(this.id, field, this.guildId);
    const updatedData = await this.#rest.request("PATCH", route, { [field]: -amount });

    this.#updateInternals(updatedData);
    return this;
  };
  async set(key, value) {
    assert(key && typeof key == "string", "Key must be a string");
    assert(value, "Value must be present");

    const route = Routes.guilds.users.resource(this.id, key, this.guildId);
    const updatedData = await this.#rest.request("PATCH", route, { set: value });
    this.#updateInternals(updatedData);
    return this;
  };

  #updateInternals(data) {
    for (let key in data) {
      if (key == "id" || key == "_id" || key == "guildId") continue;
      if (this[key]) this[key] = data[key];
    }

    this.manager.set(data.id, data);
  }
  toString() {
    return `<@${this.id}>`;
  }
}

module.exports = { User };
