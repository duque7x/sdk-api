import { REST } from "../rest/REST";
import { Player } from "../structures/BaseUser";
import { BetUser, BetUserData } from "../structures/BetUser";
import { Collection } from "../structures/Collection";

export class BetUsersManager {
  #betUsers: Collection<string, BetUser>;

  constructor(rest: REST, guildId: string);

  set(id: string, user: BetUser): void;

  fetch(id: string, name: string): Promise<BetUser | undefined>;

  fetchAll(): Promise<Collection<string, BetUser>>;

  get cache(): Collection<string, BetUser>;

  create(payload: Player): Promise<BetUser>;

  delete(id: string): Promise<void>;

  deleteAll(): Promise<void>;

  cacheUsers(): Promise<Collection<string, BetUser>>;

  update(id: string, payload: BetUserData): Promise<BetUser | undefined>;
}
