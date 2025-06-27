import { GuildsManager } from "../managers/GuildsManager";
import { Collection } from "../structures/Collection";
import { User } from "../structures/User";
import { Bet } from "../structures/Bet";
import { Match } from "../structures/Match";
import { Guild } from "../structures/Guild";
import { BetUser } from "../structures/BetUser";
import { EventEmitter } from 'events'; // Import if needed

type EventMap = {
    userCreate: User;
    betUserCreate: BetUser;
    betUpdate: Bet;
    guildDelete: Guild;
    matchEnd: Match;
};

export declare class REST extends EventEmitter {
    constructor(clientKey?: string);

    /**
     * Makes a REST request and returns the updated body.
     * @param method HTTP method (e.g., GET, POST)
     * @param path Endpoint path
     * @param body Optional request body (will be updated and returned)
     * @returns Promise resolving with the updated body
     */
    request<T = any>(method: string, path: string, body?: T): Promise<T>;

    /**
     * Initializes the REST client.
     */
    init(): Promise<void>;

    guilds: GuildsManager;
    users: Collection<string, User>;
    betUsers: Collection<string, BetUser>;
    bets: Collection<string, Bet>;
    matches: Collection<string, Match>;

    on<K extends keyof EventMap>(eventName: K, listener: (args: EventMap[K]) => void): this;
    on(eventName: "userCreate", listener: (args: User) => void): this;
    on(eventName: "guildUpdate", listener: (args: Guild) => void): this;

    /**
     * 
     * @param key This is the key that allows customers to have acess to the bots!
     * Can not be bypassed by anyone
     */
    setClientKey(key: string): REST;
}