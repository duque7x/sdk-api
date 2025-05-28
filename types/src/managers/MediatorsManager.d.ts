import { Collection } from "../structures/Collection";
import { Mediator } from "../structures/Mediator";
import { REST } from "../rest/REST";

declare type MediatorData = {
  id: string;
  name?: string;
  paymentLinks?: string[];
  createdAt?: Date;
}

export declare class MediatorsManager {
  guildId: string;

  constructor(rest: REST, guildId: string);

  get cache(): Collection<string, Mediator>;

  create(payload: MediatorData): Promise<Mediator>;

  set(id: string, mediator: Mediator): void;

  fetch(id: string): Promise<Mediator>;

  fetchAll(): Collection<string, Mediator>;

  remove(id: string): Promise<void>;

  removeAll(): Promise<void>;

  update(payload: MediatorData): Promise<void>;

  cacheMediators(): Collection<string, Mediator>;
};