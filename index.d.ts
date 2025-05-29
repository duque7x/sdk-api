declare module "REST";

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
export * from "./types/src/payloads/CreateGuildPayload";
export * from "./types/src/payloads/MatchCreatePayload";
export * from "./types/src/payloads/UserCreatePayload";


export interface BetUserFields {
  /**
* The amount of credit the player has achieved.
* @default 0
*/
  credit?: number;

  /**
* The number of MVPs the player has achieved.
* @default 0
*/
  mvps?: number;

  /**
 * The number of losses the player has suffered.
 * @default 0
 */
  losses?: number;

  /**
   * Indicates whether the player is blacklisted.
   * @default false
   */
  blacklisted?: boolean;
}
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
export declare enum MATCHSTATUS {
    ON = "ON",           // Match is active
    OFF = "OFF",         // Match is inactive
    CREATED = "CREATED", // Match was created but not started
    SHUTTED = "SHUTTED"  // Match was forcefully closed
}
export declare enum MATCHTYPES {
  OneVOne = "1v1",
  TwoVTwo = "2v2",
  ThreeVThree = "3v3",
  FourVFour = "4v4",
  FiveVFive = "5v5",
  SixVSix = "6v6",
}


/**
 * Interface representing a single player.
 */
export declare interface Player {
  /** The unique Discord user ID of the player */
  id: string;

  /** The display name of the player */
  name?: string;
}