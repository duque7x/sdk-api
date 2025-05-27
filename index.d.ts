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