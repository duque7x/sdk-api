const Routes = require("../rest/Routes");
const assert = require('node:assert');

class User {
  #rest;
  #data;
  /**
   * 
   * @param {*} data 
   */
  constructor(data, rest, guildId) {
    this.id = data.id;
    this.name = data.name;
    this.points = data.points;
    this.wins = data.wins;
    this.mvps = data.mvps;
    this.losses = data.losses;
    this.gamesPlayed = data.gamesPlayed;
    this.blacklisted = data.blacklisted;
    this.protections = data.protections;
    this.originalChannels = data.originalChannels;
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

      for (let op in options) {
        const route = Routes.guilds.users.resource(this.id, op.toLowerCase(), this.guildId);
        await this.#rest.request("DELETE", route);
        this[op] = options[op];
      }
      return this;
    }
    if (typeof key !== "string") throw new Error("key must be a string");
    this.#verifyField(key);
    const route = Routes.guilds.users.resource(this.id, key.toLowerCase(), this.guildId);
    const reset = await this.#rest.request("DELETE", route);
    this[key] = reset;

    return this;
  };
  async delete() {
    const route = Routes.guilds.users.delete(this.id, this.guildId);
    await this.#rest.request("delete", route);
    return;

  };
  async add(field, amount = 1) {
    this.#verifyField(field);
    const route = Routes.guilds.users.resource(this.id, field, this.guildId);
    const updatedField = await this.#rest.request("PATCH", route, { [field]: amount });

    this[field] = updatedField;
    return this[field];
  };
  async remove(field, amount = 1) {
    this.#verifyField(field);
    const route = Routes.guilds.users.resource(this.id, field, this.guildId);
    const updatedField = await this.#rest.request("PATCH", route, { [field]: -amount });

    this[field] = updatedField;
    return this;
  };
  async set(key, value) {
    if (typeof key !== "string") throw new Error("key must be a string");
    this.#verifyField(key);
    const route = Routes.guilds.users.resource(this.id, field, this.guildId);
    const updatedField = await this.#rest.request("PATCH", route, { set: value });

    this[key] = updatedField;

    return this;
  };
  #validFields = [
    "wins",
    "points",
    "losses",
    "mvps",
    "gamesPlayed",
    "blacklisted",
  ];
  #verifyField(field) {
    if (!this.#validFields.includes(field)) throw new Error(`Invalid field "${field}" for update`);
  }
}

module.exports = { User };
