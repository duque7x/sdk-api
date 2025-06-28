const { Collection } = require("../../structures/Collection");
const Routes = require("../../rest/Routes");
const assert = require('node:assert');
const { Channels } = require("../../structures/Channels");
const { Channel } = require("../../structures/Channel");

exports.ChannelsManager = class {
  #rest;
  #channels;
  /**
     * 
     * @param {import("../../../types/src/rest/REST").REST} rest 
     * @param {string} guildId 
     */
  constructor(data, rest) {
    this.guildId = data?.guildId;
    this.field = data?.field;

    this.#rest = rest;
    this.#channels = new Collection();

    this.#updateChannels(data.channels);
  }

  get cache() {
    return this.#channels;
  }

  set(id, channels) {
    assert(id && typeof id === "string", `${id} must be a string and a Discord Snowflake`);
    return this.#set(channels);
  }

  async fetchAll() {
    const route = Routes.guilds.channels.getAll(this.guildId);
    const payload = { guildId: this.guildId };
    const response = await this.#rest.request("GET", route, payload);

    this.#channels.clear();
    for (let channelData of response) {
      this.#set(channelData);
    }
    return this.#channels;
  }

  async create(payload) {
    assert(payload && typeof payload === "object", "Payload must be an object");
    assert(payload.id && typeof payload.id === "string", "Payload id must be a string");
    assert(payload.name && typeof payload.name === "string", "Payload must include name");

    const route = Routes.guilds.channels.create(this.guildId);  // Use correct route
    const response = await this.#rest.request("POST", route, payload);
    const channels = new Channel(response, this.#rest, this.guildId, this);

    this.#set(channels);
    this.#rest.emit("betUserCreate", channels);
    return channels;
  }

  async update(payload) {
    assert(payload && typeof payload === "object", "Payload must be an object");
    assert(payload.id && typeof payload.id === "string", "Payload id must be a string");
    assert(payload.name && typeof payload.name === "string", "Payload must include name");
    payload.guildId = this.guildId;

    const route = Routes.guilds.channels.update(payload.id, this.guildId);  // Use correct route
    const response = await this.#rest.request("PATCH", route, payload);
    const userBefore = this.#channels.get(payload.id);
    const channels = new Channel(response, this.#rest, this.guildId, this);

    this.#rest.emit("betUserUpdate", userBefore, channels);
    this.#set(channels);

    return channels;
  }

  async delete(id) {
    assert(id && typeof id === "string", "Id must be a string");

    const route = Routes.guilds.channels.delete(id, this.guildId);
    await this.#rest.request("DELETE", route, { guildId: this.guildId });

    this.#rest.emit("betUserDelete", this.#channels.get(id));
    this.#removeIdFromCache(id);
    return this.#channels;
  }

  async deleteAll() {
    const route = Routes.guilds.channels.deleteAll(this.guildId);
    await this.#rest.request("DELETE", route, { guildId: this.guildId });
    this.#rest.emit("betUsersDelete", this.#channels);
    this.#channels.clear();
  }

  #removeIdFromCache(id) {
    this.#channels.delete(id);
  }

  #set(data) {
    const channels = data instanceof Channels
      ? data
      : new Channels(data, this.#rest, this.field, this.guildId, this);

    const existing = this.#channels.get(channels.type);
    if (existing) {
      // Merge IDs safely
      channels.ids = Array.from(new Set([...existing.ids, ...channels.ids]));
    }

    this.#channels.set(channels.type, channels);
    return channels;
  }
  #updateChannels(data) {
    for (let channel of data || []) this.#set(channel);
  }
}