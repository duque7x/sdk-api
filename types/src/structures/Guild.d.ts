import { MatchesManager } from "../managers/MatchesManager";
import { UserManager } from "../managers/UserManager";
import { BetsManager } from "../managers/BetsManager";
import { BetUsersManager } from "../managers/BetUsersManager";
import { REST } from "../rest/REST";
import { MediatorsManager } from "../managers/MediatorsManager";
import {
  BlackListed,
  Emoji,
  GroupedChannel,
  GuildData,
  GUILDSTATUS,
  NormalGuildKeys,
  NormalMessage,
  Role,
  TicketsConfiguration,
} from "../../..";
import { Shop } from "./Shop";
import { TicketsManager } from "../managers/TicketsManager";
import {  GroupedChannelManager } from "../managers/GroupedChannelManager";

export class Guild {
  ticketsConfiguration: TicketsConfiguration;
  tickets: TicketsManager;

  blacklist: BlackListed[];

  prefix: string;
  id: string;
  seasonId: string;

  channels: GroupedChannelManager;

  categories: GroupedChannelManager;

  roles: Role[];
  messages: NormalMessage[];
  emojis: Emoji[];

  name: string;
  _id: string;
  pricesOn: number[];
  pricesAvailable: number[];
  status: GUILDSTATUS;

  users: UserManager;
  betUsers: BetUsersManager;
  bets: BetsManager;
  matches: MatchesManager;
  mediators: MediatorsManager;

  /**
   * This the guild shop with products
   */
  shop: Shop;

  constructor(data: GuildData, rest: REST);

  get data(): GuildData;

  add<F extends keyof NormalGuildKeys, A = NormalGuildKeys[F]>(
    key: F,
    value: A
  ): Promise<A>;

  remove<F extends keyof NormalGuildKeys, A = NormalGuildKeys[F]>(
    key: F,
    value: A
  ): Promise<A>;

  set<F extends keyof NormalGuildKeys, A = NormalGuildKeys[F]>(
    key: F,
    value: A
  ): Promise<A>;

  setStatus<K extends keyof GUILDSTATUS, V = "on" | "off">(
    key: K,
    value: V
  ): Promise<Guild>;

  addRole(type: string, id: string): Promise<Guild>;
  removeRole(type: string, id: string): Promise<Guild>;

  addCategory(type: string, id: string): Promise<Guild>;
  removeCategory(type: string, id: string): Promise<Guild>;

  addChannel(type: string, id: string): Promise<Guild>;
  removeChannel(type: string, id: string): Promise<Guild>;

  setBlacklist(value: boolean, id: string, adminId: string): Promise<Guild>;

  addMessage(type: string, id: string): Promise<Guild>;
  removeMessage(type: string, id: string): Promise<Guild>;

  addEmoji(type: string, id: string, animated?: boolean): Promise<Guild>;
  removeEmoji(type: string, id: string): Promise<Guild>;

  /**
   * Fetches the guild and returns the most updated data
   */
  fetch(): Promise<Guild>;
}
