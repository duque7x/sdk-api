import { REST } from "../rest/REST";
import { BaseUser, Player } from "./BaseUser";

type BetUserData = {
  name: string;
  id: string;
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

export class BetUser extends BaseUser {
  credit: number;
  betsPlayed?: string[];
  
  constructor(data: BetUserData, rest: REST, guildId: string);

  get data(): BetUserData;

  reset<F extends keyof BetUserData>(key: F): Promise<BetUserData>;

  delete(): Promise<BetUserData>;

  add<F extends keyof BetUserData, A = BetUserData[F]>(field: F | string, amount: A): Promise<BetUserData>;

  remove<F extends keyof BetUserData, A = BetUserData[F]>(field: F | string, amount: A): Promise<BetUserData>;

  set<F extends keyof BetUserData, A = BetUserData[F]>(key: F | string, value: A): Promise<BetUserData>;
}
