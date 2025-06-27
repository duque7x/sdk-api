import { MediatorsManager } from "./types/src/managers/MediatorsManager";
import { Bet } from "./types/src/structures/Bet";
import { BetUser } from "./types/src/structures/BetUser";
import { Guild } from "./types/src/structures/Guild";
import { Match } from "./types/src/structures/Match";
import { User } from "./types/src/structures/User";

declare module "REST";

/**
 * Represents a protection type that can be applied to a user,
 * such as immunity, point protection, or double points bonus.
 * Contains details about duration and who added it.
 */
export interface UserProtection {
  type: "point_protect" | "immunity" | "double_points";
  longevity: number;
  addedBy: string;
  when: Date;
}

/**
 * Represents an association between a user and the original match channel.
 * Useful for tracking voice or text channels per match.
 */
export interface UserOriginalChannel {
  channelId: string;
  matchId: string;
}

/**
 * Defines the basic numeric and status fields for a user,
 * such as wins, points, and blacklist status.
 */
export interface BaseUserNumericFields {
  wins: number;
  points: number;
  mvps: number;
  losses: number;
  gamesPlayed: string[];
  blacklisted: boolean;
}

/**
 * Optional fields that can be stored for a bet user record in the database.
 */
export interface BetUserKeys {
  /**
   * The amount of credit the player has.
   * @default 0
   */
  credit?: number;

  /**
   * The number of MVPs achieved by the player.
   * @default 0
   */
  mvps?: number;

  /**
   * The number of losses the player has.
   * @default 0
   */
  losses?: number;

  /**
   * Indicates if the player is blacklisted.
   * @default false
   */
  blacklisted?: boolean;
}

/**
 * Defines the shape of event types emitted by the system,
 * mapping event names to their payload types.
 */
export type EventMap = {
  userCreate: User;
  betUserCreate: BetUser;
  betUpdate: Bet;
  guildDelete: Guild;
  matchEnd: Match;
};

/**
 * Represents a confirmation object holding IDs and count
 * for confirmed entities such as players or bets.
 */
export interface Confirmed {
  ids: string[];
  type: string;
  count: number;
}

/**
 * Represents a basic channel structure
 * with ID and type information.
 */
export interface GroupedChannel {
  ids: string;
  type: string;
}

/**
 * Represents a basic message structure
 * with ID and type information.
 */
export interface NormalMessage {
  id: string;
  type: string;
}

/**
 * Defines the full data shape for a bet user,
 * including optional profile and stats fields.
 */
export interface BetUserData {
  name?: string;
  id?: string;

  /**
   * Credit balance.
   * @default 0
   */
  credit?: number;

  /**
   * Number of MVP awards.
   * @default 0
   */
  mvps?: number;

  /**
   * Number of losses.
   * @default 0
   */
  losses?: number;

  /**
   * Indicates if the user is blacklisted.
   * @default false
   */
  blacklist?: boolean;

  wins?: number;
  betsPlayed?: string[];

  type?: "add" | "remove" | string;

  createdAt?: Date;
  updatedAt?: Date;
  coins?: number;
  dailyWins?: DailyWins;

  profileCard?: {
    description?: string;
    banner?: {
      equipped: number;
      allowed: number[];
    };
  };
}

/**
 * Possible operational states of the system.
 */
export enum STATES {
  ON = "on",
  OFF = "off",
  CREATED = "created",
  SHUTTED = "shutted",
  WAITING = "waiting",
}

/**
 * Represents the basic on/off status of features.
 */
export enum BASESTATUS {
  ON = "on",
  OFF = "off",
}

/**
 * Defines the structure for a mediator user,
 * including ID, name, join time, and payment links.
 */
export interface Mediator {
  id: string;
  name?: string;
  joinedAt?: Date;
  paymentLinks?: string[];
}

/**
 * Represents a blacklisted user entry with
 * details about who added them and when.
 */
export interface BlackListed {
  id: string;
  addedBy: string;
  when: Date;
}

/**
 * Represents the configuration status of various guild features.
 */
export interface GUILDSTATUS {
  bets: "on" | "off";
  matches: "on" | "off";
  dailyRank: "on" | "off";
  createVoiceChannels: "on" | "off";
}

/**
 * Holds configuration and resources available in a guild,
 * including channels, roles, prices, and mediators.
 */
export interface NormalGuildKeys {
  blacklist: BlackListed;
  prefix: string;
  pricesOn: number;
  pricesAvailable: number;
  status: GUILDSTATUS;
  seasonId: string;
  mediators: Mediator[];

  channels: {
    dailyRank: GroupedChannel;
    blacklist: GroupedChannel;
  };

  categories: {
    bets: GroupedChannel;
    betsChannel: GroupedChannel;
  };

  roles: Role[];
}

/**
 * Represents an emoji used in the system,
 * with animation status.
 */
export interface Emoji {
  id: string;
  type: string;
  animated?: boolean;
}

/**
 * Represents a role within the guild.
 */
export interface Role {
  ids: string[];
  type: string;
}

/**
 * Defines the database-stored structure of a guild.
 */
export interface GuildData {
  prefix: string;
  id: string;
  name: string;
  _id: string;
  pricesOn: number[];
  pricesAvailable: number[];
  status: GUILDSTATUS;
  seasonId: string;
  betsChannelId: string;
  mediators: MediatorsManager;
}

/**
 * Represents the configuration for a single channel.
 */
export interface BasicChannelData {
  id: string;
  type: string;
}

/**
 * Represents the tracking of a player's daily wins,
 * with date information.
 */
export interface DailyWins {
  amount: number;
  date: Date;
}

/**
 * Represents the possible states of a match.
 */
export enum MATCHSTATUS {
  ON = "ON",
  OFF = "OFF",
  CREATED = "CREATED",
  SHUTTED = "SHUTTED",
}

/**
 * Defines the available match types by team size.
 */
export enum MATCHTYPES {
  OneVOne = "1v1",
  TwoVTwo = "2v2",
  ThreeVThree = "3v3",
  FourVFour = "4v4",
  FiveVFive = "5v5",
  SixVSix = "6v6",
}

/**
 * Interface representing an individual player.
 */
export interface Player {
  /**
   * The unique Discord user ID of the player.
   */
  id: string;

  /**
   * The display name of the player.
   */
  name?: string;
}

/**
 * Type alias for an array of Player objects.
 */
export type Players = Player[];

/**
 * Interface for a confirmed player record,
 * including confirmation type and setup status.
 */
export interface ConfirmedPlayer {
  id: string;
  name: string;
  typeConfirm: string;
  setted: boolean;
}

/**
 * Defines the shape of a mediator record
 * with ID, name, and payment details.
 */
export interface MediatorData {
  id: string;
  name?: string;
  paymentLinks?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents a channel with its ID and name.
 */
export interface ChannelInfo {
  id: string;
  name: string;
}

/**
 * Interface representing the data for a single bet.
 */
export interface BetData {
  type: BETTYPES;
  price: number;
  payedBy: string;
  mediatorId: string;
  confirmed: Confirmed[];
  channels: GroupedChannel[];
  messages: NormalMessage[];
  status: STATES;
  embedMessageId: string;
  winner: string;
  loser: string;
  teamA: string;
  teamB: string;
  creatorId: string;
  adminId: string;
  _id: string;
}

/**
 * Enum of available bet types by match size.
 */
export enum BETTYPES {
  OneVOne = "1v1",
  TwoVTwo = "2v2",
  ThreeVThree = "3v3",
  FourVFour = "4v4",
}

/**
 * Defines the structure of a log message,
 * including content, user ID, type, and timestamps.
 */
export interface LogMessage {
  content: string | { data: ArrayBuffer; type: string };
  userId: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Exports the Routes utility for REST API paths.
 */
export declare const Routes: {
  base: string;

  field: () => string;
  fields: (field: string[]) => string;

  guilds: {
    get: (id: string) => string;
    getAll: () => string;
    create: () => string;
    delete: (id: string) => string;
    deleteAll: () => string;
    resource: (resourceName: string, guildId: string) => string;

    users: {
      getAll: (guildId: string) => string;
      get: (userId: string, guildId: string) => string;
      create: (guildId: string) => string;
      update: (userId: string, guildId: string) => string;
      delete: (userId: string, guildId: string) => string;
      deleteAll: (guildId: string) => string;
      resource: (userId: string, resourceName: string, guildId: string) => string;
    };

    betUsers: {
      getAll: (guildId: string) => string;
      get: (userId: string, guildId: string) => string;
      create: (guildId: string) => string;
      update: (userId: string, guildId: string) => string;
      delete: (userId: string, guildId: string) => string;
      deleteAll: (guildId: string) => string;
      resource: (userId: string, resourceName: string, guildId: string) => string;
    };

    matches: {
      getAll: (guild: string) => string;
      get: (matchId: string, guildId: string) => string;
      create: (guild: string) => string;
      update: (matchId: string, guildId: string) => string;
      delete: (matchId: string, guildId: string) => string;
      deleteAll: (guild: string) => string;
      resource: (matchId: string, resourceName: string, guildId: string) => string;
    };

    bets: {
      getAll: (guildId: string) => string;
      get: (betId: string, guildId: string) => string;
      create: (guildId: string) => string;
      update: (betId: string, guildId: string) => string;
      delete: (betId: string, guildId: string) => string;
      deleteAll: (guildId: string) => string;
      resource: (guildId: string, args: string[]) => string;
    };
  };
};

export * from "./types/src/managers/UserManager";
export * from "./types/src/managers/MatchesManager";
export * from "./types/src/managers/BetsManager";
export * from "./types/src/managers/BetUsersManager";

export * from "./types/src/structures/User";
export * from "./types/src/structures/BetUser";
export * from "./types/src/structures/Guild";
export * from "./types/src/structures/Match";
export * from "./types/src/structures/Bet";
export * from "./types/src/structures/Collection";
export * from "./types/src/rest/REST";

export * from "./types/src/payloads/BetCreatePayload";
export * from "./types/src/payloads/MatchCreatePayload";
export * from "./types/src/payloads/UserCreatePayload";