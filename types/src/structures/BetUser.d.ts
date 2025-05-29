import { REST } from "../rest/REST";
import { BaseUser } from "./BaseUser";

type BetUserData = {
  name?: string;
  id?: string;
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
   * Indicates whether the player is blacklist.
   * @default false
   */
  blacklist?: boolean;

  wins?: number;
  betsPlayed?: string[];

  type?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export class BetUser extends BaseUser {
  credit: number;
  betsPlayed?: string[];

  constructor(data: BetUserData, rest: REST, guildId: string);

  get data(): BetUserData;

  delete(): Promise<BetUserData>;

  add<F extends keyof BetUserData, A = BetUserData[F]>(field: F, amount: A): Promise<BetUserData>;

  remove<F extends keyof BetUserData, A = BetUserData[F]>(field: F | string, amount: A): Promise<BetUserData>;

  set<F extends keyof BetUserData, A = BetUserData[F]>(key: F | string, value: A): Promise<BetUserData>;

  update(payload:  BetUserData): Promise<BetUser>;

  reset(key: keyof BetUserData): Promise<BetUser>;

  reset(): Promise<BetUser>;
}
