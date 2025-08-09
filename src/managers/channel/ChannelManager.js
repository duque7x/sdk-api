/* eslint-disable no-unused-private-class-members */
const { Collection } = require("../../structures/Collection");
const Routes = require("../../rest/Routes");
const assert = require('node:assert');
const { Channel } = require("../../structures/Channel");

exports.ChannelManager = class {
  static child = Channel;

  #rest;
  #channels;
  /**
     * 
     * @param {import("../../../types/src/rest/REST").REST} rest 
     * @param {string} guildId 
     */
  constructor(data, rest) {
    this.structure = data?.structure;
    this.baseUrl = data?.baseUrl;

    this.guildId = data?.guildId;
    this.field = data?.field;

    this.#rest = rest;
    this.#channels = new Collection();

    this.#updateChannels(data.channels);
  }
  get cache() {
    return this.#channels;
  }
  async setTo(channels) {
    channels = this.resolvePayload(channels);
    assert(channels && typeof channels === "object", `${channels} must be an object`);

    const route = this.baseUrl;
    const response = await this.#rest.request("PATCH", route, { set: channels });

    this.#channels.clear();
    for (let channelData of response) {
      this.#set(channelData);
    }
    return this.#channels;
  }
  resolvePayload(payload) {
    if (!Array.isArray(payload)) payload = [payload];
    return payload;
  }
  set(id, channel) {
    assert(id && typeof id === "string", `${id} must be a string and a Discord Snowflake`);
    return this.#set(channel);
  }
   async update(type, payload) {
      assert(type && typeof type === "string", `${type} must be a string and a Discord Snowflake`);
      assert(payload && typeof payload === "object", "Payload must be an object");
  
      const route = Routes.fields(this.baseUrl, type);
      const response = await this.#rest.request("PATCH", route, payload);
      const channelBefore = this.cache.get(type);
      const channel = this.set(response.type, response);
  
      this.#rest.emit("channelUpdate", channelBefore, channel);
  
      return channel;
    }
  async fetch(type) {
    assert(type && typeof type === "string", `${type} must be a string`);

    const route = Routes.fields(this.baseUrl, type);
    const response = await this.#rest.request("GET", route);
    return this.#set(response);
  }
  async fetchAll() {
    const response = await this.#rest.request("GET", this.baseUrl);
    for (let channelData of response) this.#set(channelData);
    return this.#channels;
  }

  async create(payload) {
    assert(payload && typeof payload === "object", "Payload must be an object");
    assert(payload.id && typeof payload.id === "string", "Payload id must be a string");
    assert(payload.type && typeof payload.type === "string", "Payload must include type");

    const route = this.baseUrl;
    const response = await this.#rest.request("POST", route, payload);
    const channel = this.#set(response);

    this.#rest.emit("channelCreate", channel);
    return channel;
  }

  async delete(type) {
    assert(type && typeof type === "string", "Type of channel must be a string");

    const route = this.baseUrl;
    const response = await this.#rest.request("DELETE", Routes.fields(route, type));
    this.#updateChannels(response);
    return this.#channels;
  }

  async deleteAll() {
    const route = this.baseUrl;
    const value = await this.#rest.request("DELETE", route);
    this.#channels.clear();
    return value;
  }
  #removeIdFromCache(id) {
    this.#channels.delete(id);
  }
  #set(data) {
    if (!data || !data.id) return;
    const channelData = { id: data?.id, type: data?.type, manager: this, guildId: this.guildId, baseUrl: Routes.fields(this.baseUrl, data?.type) };

    const channel = data instanceof Channel ? data : new Channel(channelData, this.#rest);
    this.#channels.set(channel.type, channel);
    return channel;
  }

  #updateChannels(data) {
    for (let channel of data || []) this.#set(channel);
  }
}