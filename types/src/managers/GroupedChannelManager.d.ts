import { GroupedChannelData } from "../../..";
import { REST } from "../rest/REST";
import { Collection } from "../structures/Collection";
import { GroupedChannel } from "../structures/GroupedChannel";

export class GroupedChannelManager {
  constructor(rest: REST, guildId: string, field: string);

  /**
   * Collection of GroupedChannel's very useful
   * @returns Collecion<string, GroupedChannel>
   */
  get cache(): Collection<string, GroupedChannel>;

  /**
   * Create a GroupedChannel in a 'structure' such as Bet
   * @param type The type of the category
   * @param ids The ids of the category
   */
  create(type: string, ids?: string[]): Promise<GroupedChannel>;
  create(type: string, ids?: string): Promise<GroupedChannel>;

  /**
   * Updates a certain channel.
   * @param type This is the type of the channel
   * @param payload This is the payload
   */
  update(type: string, payload: GroupedChannelData): Promise<GroupedChannel>;
  /**
   * Set the GroupedChannel in the cache.
   * @param id The GroupedChannel's id
   * @param GroupedChannel The GroupedChannel's data
   */
  set(id: string, GroupedChannel: GroupedChannelData): GroupedChannel;
  set(id: string, GroupedChannel: GroupedChannel): GroupedChannel;

  /**
   * Fetch a particular GroupedChannel
   * @param type The type of the GroupedChannel
   */
  fetch(type: string): Promise<GroupedChannel>;

  /**
   * Fetch all GroupedChannel's in a 'structure' such as Bet
   * @returns A collection of GroupedChannels
   */
  fetchAll(): Promise<Collection<string, GroupedChannel>>;

  /**
   * Delete a GroupedChannel of the given type
   * @param type The GroupedChannel's type
   */
  delete(type: string): Promise<Collection<string, GroupedChannel>>;

  /**
   * Delete all GroupedChannels in a 'structure' such as Bet
   */
  deleteAll(): Promise<void>;
}
