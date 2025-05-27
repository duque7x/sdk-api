import EventEmmiter from "node:events";
import { GuildsManager } from "../managers/GuildsManager";
import { Collection } from "../structures/Collection";
import { User } from "../structures/User";
import { Bet } from "../structures/Bet";
import { Match } from "../structures/Match";
import { BetUser } from "../structures/BetUser";

export declare class REST extends EventEmmiter {
    request(method: string, path: string, body?: any): Promise<body>;
    init(): Promise<void>;
    guilds: GuildsManager;

    users: Collection<string, User>;
    betUsers: Collection<string, BetUser>;
    bets: Collection<string, Bet>;
    matches: Collection<string, Match>;

    on<K>(eventName: string | symbol, listener: (...args: any[]) => void): this;
    on(eventName: "userCreate", listener: (args: User) => void): this;
}