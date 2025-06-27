export class BaseUser {
  constructor();

  name: string;
  id: string;

  guildId: string;
  /**
   * The number of wins the player has.
   * @default 0
  */
  wins: number;

  /**
  * The number of MVPs the player has achieved.
  * D@default 0
  */
  mvps: number;

  /**
 * The number of losses the player has suffered.
 * @default 0
 */
  losses: number;

  /**
   * Indicates whether the player is blacklisted.
   * @default false
   */
  blacklist: boolean;

  /**
     * The date of the creation of the user
     */
  createdAt: Date;

  /**
   * The last date where the user was updated
   */
  updatedAt: Date;

  /**
       * Returns a string representation of this structure
       */
  toString(): string;
}