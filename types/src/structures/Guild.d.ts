import { MatchesManager } from "../managers/MatchesManager";
import { UserManager } from "../managers/UserManager";
import { BetsManager } from "../managers/BetsManager";
import { BetUsersManager } from "../managers/BetUsersManager";
import { REST } from "../rest/REST";
import { MediatorsManager } from "../managers/MediatorsManager";
import { BlackListed, Emoji, GroupedChannel, GuildData, GUILDSTATUS, NormalGuildKeys, NormalMessage, Role } from "../../..";


export class Guild {
    blacklist: BlackListed[];

    prefix: string;
    id: string;
    seasonId: string;

    channels: GroupedChannel[];

    categories: GroupedChannel[];

    roles: Role[];
    messages: NormalMessage[];
    emojis: Emoji[];

    name: string;
    _id: string;
    pricesOn: number[];
    pricesAvailable: number[];
    status: GUILDSTATUS;

    users: UserManager;
    betUsers: BetUsersManager;
    bets: BetsManager;
    matches: MatchesManager;
    mediators: MediatorsManager;

    constructor(data: GuildData, rest: REST);

    get data(): GuildData;

    add<F extends keyof NormalGuildKeys, A = NormalGuildKeys[F]>(
        key: F,
        value: A
    ): Promise<A>;

    remove<F extends keyof NormalGuildKeys, A = NormalGuildKeys[F]>(
        key: F,
        value: A
    ): Promise<A>;

    set<F extends keyof NormalGuildKeys, A = NormalGuildKeys[F]>(
        key: F,
        value: A
    ): Promise<A>;

    setStatus<K extends keyof GUILDSTATUS, V = "on" | "off">(key: K, value: V): Promise<Guild>;

    addRole(type: string, id: string): Promise<Guild>;
    removeRole(type: string, id: string): Promise<Guild>;

    addCategory(type: string, id: string): Promise<Guild>;
    removeCategory(type: string, id: string): Promise<Guild>;

    addChannel(type: string, id: string): Promise<Guild>;
    removeChannel(type: string, id: string): Promise<Guild>;

    setBlacklist(value: boolean, id: string, adminId: string): Promise<Guild>;

    addMessage(type: string, id: string): Promise<Guild>;
    removeMessage(type: string, id: string): Promise<Guild>;

    addEmoji(type: string, id: string, animated?: boolean): Promise<Guild>;
    removeEmoji(type: string, id: string): Promise<Guild>;
}
