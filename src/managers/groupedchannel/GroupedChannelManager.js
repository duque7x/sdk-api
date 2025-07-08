const Routes = require("../../rest/Routes");
const assert = require('node:assert');
const { GroupedChannel } = require("../../structures/GroupedChannel");
const { BaseManager } = require("../BaseManager");

exports.GroupedChannelManager = class GroupedChannelManager extends BaseManager {
  #rest;

  constructor(data, rest) {
    super(data?.channels);

    this.baseUrl = data?.baseUrl;
    this.guild = data?.guild;

    this.#rest = rest;

    this.#updateChannels(data?.channels);
  }

  set(type, data) {
    if (!type || !data) return this.cache;
    
    const channelData = {
      ids: data.ids,
      type: data.type,
      guild: this.guild,
      baseUrl: this.baseUrl,
      manager: this
    }
    const channel = data instanceof GroupedChannel
      ? data
      : new GroupedChannel(channelData, this.#rest);

    const existing = this.cache.get(channel.type);
    if (existing) channel.ids = Array.from(new Set([...existing.ids, ...channel.ids]));

    this.cache.set(channel.type, channel);
    return channel;
  }
  resolveIds(ids) {
    if (!ids) ids == [];
    if (!Array.isArray(ids)) ids = [ids];
    if (Array.isArray(ids)) ids = ids.flat();

    return ids;
  }
  async create(type, ids) {
    assert(type && typeof type === "string", "Type must be a string");
    ids = this.resolveIds(ids);

    const payload = { type, ids };
    const route = this.baseUrl;
    const response = await this.#rest.request("POST", route, payload);
    console.log({ response });
    
    const GroupedChannel = this.set(response.type, response);

    this.#rest.emit("groupedChannelCreate", GroupedChannel);
    return GroupedChannel;
  }

 
  async fetch(type) {
    assert(type && typeof type === "string", `${type} must be a string and a Discord Snowflake`);

    const route = Routes.fields(this.baseUrl, type);
    const payload = { guildId: this.guild.id };
    const response = await this.#rest.request("GET", route, payload);

    this.#updateChannels(response);
    return this.cache;
  }
  async fetchAll() {
    const route = this.baseUrl;
    const payload = { guildId: this.guild.id };
    const response = await this.#rest.request("GET", route, payload);

    this.#updateChannels(response);
    return this.cache;
  }

  async update(type, payload) {
    assert(type && typeof type === "string", `${type} must be a string and a Discord Snowflake`);
    assert(payload && typeof payload === "object", "Payload must be an object");

    const route = Routes.fields(this.baseUrl, type);
    const response = await this.#rest.request("PATCH", route, payload);
    const channelBefore = this.cache.get(type);
    const GroupedChannel = this.set(response.type, response);

    this.#rest.emit("groupedChannelUpdate", channelBefore, GroupedChannel);

    return GroupedChannel;
  }

  async delete(type) {
    assert(type && typeof type === "string", "Type must be a string");

    const route = Routes.fields(this.baseUrl, type);
    const value = await this.#rest.request("DELETE", route);

    this.#rest.emit("groupedChannelDelete", this.cache.get(type));
    this.#removeIdFromCache(type);
    return value;
  }

  async deleteAll() {
    const route = this.baseUrl;
    const value = await this.#rest.request("DELETE", route, { guildId: this.guild.id });
    this.#rest.emit("groupedChannelsDelete", this.cache);
    this.cache.clear();

    return value;
  }

  #removeIdFromCache(id) {
    this.cache.delete(id);
  }

  #updateChannels(data) {
    for (let channel of data || []) this.set(channel.type, channel);
    this.cache = this.cache.filter(c => c !== undefined);
  }
}