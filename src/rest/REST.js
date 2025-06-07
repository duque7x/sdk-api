// src/rest/index.js
require("dotenv").config();
const { GuildsManager } = require("../managers/guilds/GuildsManager");
const Routes = require("../rest/Routes");
const { request, Headers } = require('undici');
const { EventEmitter } = require("node:events");
const { Collection } = require("../structures/Collection");

exports.REST = class extends EventEmitter {
  constructor() {
    super({ captureRejections: true });

    this.guilds = new GuildsManager(this);

    this.users = new Collection();
    this.betUsers = new Collection();
    this.matches = new Collection();
    this.bets = new Collection();
  }
  async init() {
    await this.guilds.cacheGuilds();
  }

  async request(method, path, data) {
    return await this.#requester(method, Routes.base + path, data);
  }

  async #requester(method, url, sendData) {
    try {
      const headers = new Headers()
      headers.append("duque-auth", process.env.AUTH);
      headers.append("Content-Type", 'application/json');

      const res = await request(url, {
        method,
        headers,
        body: sendData !== undefined ? JSON.stringify(sendData) : undefined,
      });
      const { data, message } = await res.body.json();
      if (message) console.log({ message });
      // console.log(`Response data`, { data }, `Message: `, { message });
      return data;
    } catch (error) {
      if (error instanceof Error) console.error('Error:', error.message);
      else console.error('Unexpected error occurred:', error);
      return { error: true, message: error.message || 'Unknown error' };
    }
  };
}