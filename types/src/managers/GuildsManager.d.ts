import { CreateGuildPayload } from "../payloads/CreateGuildPayload";
import { REST } from "../rest/REST";
import { Collection } from "../structures/Collection";
import { Guild } from "../structures/Guild";

export class GuildsManager {
    constructor(rest: REST): void;

    async fetch(id: string): Promise<Guild>;

    async create(payload: CreateGuildPayload): Promise<Guild>;

    get cache(): Collection<string, Guild>;

    async cacheGuilds(): Promise<Collection<string, Guild>>;
}