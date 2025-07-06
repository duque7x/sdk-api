import { REST } from "../rest/REST";
import { Channel } from "../structures/Channel";
import { Collection } from "../structures/Collection";

export class ChannelManager {
  constructor(rest: REST, guildId: string, field: string);

  /**
   * Collection of Channel's very useful
   * @returns Collecion<string, Channel>
   */
  get cache(): Collection<string, Channel>;

  /**
   * Create a channel in a 'structure' such as Bet
   * @param payload the channel's data such as id and type
   */
  create(payload: ChannelData): Promise<Channel>;

  /**
   * Override channels in a given 'structure'
   * @param channels An array of channels to set to
   */
  setTo(channels: ChannelData[]): Promise<Collection<string, Channel>>;
  setTo(channels: ChannelData): Promise<Collection<string, Channel>>;
  setTo(): Promise<Collection<string, Channel>>;

  /**
   * Set the channel in the cache.
   * @param id The channel's id
   * @param channel The channel's data
   */
  set(id: string, channel: ChannelData): Channel;
  set(id: string, channel: Channel): Channel;

  /**
   * Fetch a particular channel
   * @param type The type of the channel
   */
  fetch(type: string): Promise<Channel>;

  /**
   * Fetch all channel's in a 'structure' such as Bet
   * @returns A collection of channels
   */
  fetchAll(): Promise<Collection<string, Channel>>;

  /**
   * Delete a channel of the given type
   * @param type The channel's type
   */
  delete(type: string): Promise<Collection<string, Channel>>;

  /**
   * Delete all channels in a 'structure' such as Bet
   */
  deleteAll(): Promise<void>;
}
