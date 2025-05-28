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
    this.id = data?.id;
    this.name = data?.name;
    this.credit = data?.credit;
    this.wins = data?.wins;
    this.mvps = data?.mvps;
    this.losses = data?.losses;
    this.betsPlayed = data?.betsPlayed;
    this.blacklist = data?.blacklist;
    this.#rest = rest;
    this.#data = data;

    this.guildId = guildId;
  }
  get data() {
    return this.#data;
  }
  async reset(key) {
    const payload = { id: this.id, name: this.name, guildId: this.guildId };
    if (!key) {
      const options = {
        wins: 0,
        credit: 0,
        losses: 0,
        mvps: 0,
        betsPlayed: [],
        blacklist: false,
      };

      for (let op in options) {
        const route = Routes.guilds.betUsers.resource(this.id, op, this.guildId);
        await this.#rest.request("DELETE", route, payload);

        this[op] = options[op];
      }
      return this;
    }
    assert(key && typeof key === "string", "Key must be present");
    const route = Routes.guilds.betUsers.resource(this.id, op, this.guildId);
    const reset = await this.#rest.request("DELETE", route, payload);

    this[key] = reset;
    return this;
  };
  async delete() {
    const route = Routes.guilds.betUsers.delete(this.id, this.guildId);
    const payload = { id: this.id, name: this.name, guildId: this.guildId };

    await this.#rest.request("DELETE", route, payload);
    return;
  };
  async add(field, amount) {
    assert(field && typeof field === "string", "Field must be a string");
    assert(amount, "Amount must be present");

    const route = Routes.guilds.betUsers.resource(this.id, field, this.guildId);
    const payload = { id: this.id, name: this.name, [field]: amount, guildId: this.guildId };
    const updatedField = await this.#rest.request("PATCH", route, payload);

    this[field] = updatedField;
    return this[field];
  };
  async remove(field, amount) {
    assert(field && typeof field === "string", "Field must be a string");
    assert(amount, "Amount must be present");

    const route = Routes.guilds.betUsers.resource(this.id, field, this.guildId);
    const payload = { id: this.id, name: this.name, [field]: -amount, guildId: this.guildId };
    const updatedField = await this.#rest.request("PATCH", route, payload);

    this[field] = updatedField;
    return this;
  };
  async set(key, value) {
    assert(key && typeof key === "string", "Key must be a string");
    assert(value, "Value must be present");

    const route = Routes.guilds.betUsers.resource(this.id, key.toLowerCase(), this.guildId);
    const payload = { id: this.id, name: this.name, set: value, guildId: this.guildId };
    const updatedField = await this.#rest.request("PATCH", route, payload);

    this[key] = updatedField;
    return this;
  };
}
