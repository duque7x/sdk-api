import { BetUserData, DailyWins } from "../../..";
import { REST } from "../rest/REST";
import { BaseUser } from "./BaseUser";

export class BetUser extends BaseUser {
  credit: number;
  betsPlayed?: string[];
  coins: number;
  dailyWins: DailyWins;
  profileCard: {
    description: string;
    banner: {
      equipped: number;
      allowed: number[];
    };
  };

  constructor(data: BetUserData, rest: REST, guildId: string);

  get data(): BetUserData;

  delete(): Promise<BetUser>;

  add<F extends keyof BetUserData, A = BetUserData[F]>(
    field: F,
    amount: A
  ): Promise<BetUser>;

  remove<F extends keyof BetUserData, A = BetUserData[F]>(
    field: F,
    amount: A
  ): Promise<BetUser>;

  set<F extends keyof BetUserData, A = BetUserData[F]>(
    key: F,
    value: A
  ): Promise<BetUser>;

  setDescription(description: string): Promise<BetUser>;

  update(payload: BetUserData): Promise<BetUser>;

  reset(key: keyof BetUserData): Promise<BetUser>;

  reset(): Promise<BetUser>;

  setBlacklist(value: boolean): Promise<BetUser>;

  setBanner(id: number): Promise<BetUser>;

  /**
   * Returns a string representation of this structure
   */
  toString(): string;
}
