// src/rest/index.js
require("dotenv").config();
const { GuildsManager } = require("../managers/guilds/GuildsManager");
const Routes = require("../rest/Routes");
const { request } = require('undici');
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

  async #requester(method, url, data) {
    const headers = {
      "X-Duque-Auth": process.env.AUTH,
      'Content-Type': 'application/json',
    };
    const options = {
      method,
      headers,
      body: data !== undefined ? JSON.stringify(data) : undefined,
    };
    try {
      const res = await request(url, options);
      const { data, message } = await res.body.json();
      if (message) console.log({message});      
     // console.log(`Response data`, { data }, `Message: `, { message });
      return data;
    } catch (error) {
      if (error instanceof Error) console.error('Error:', error.message);
      else console.error('Unexpected error occurred:', error);
      return { error: true, message: error.message || 'Unknown error' };
    }
  };
}