import { REST } from "../rest/REST"
import { Channel } from "../structures/Channel";
import { Collection } from "../structures/Collection";

interface ChannelData {
    id: string;
    type: string;
}

export class ChannelManager {
    constructor(rest: REST, guildId: string, field: string)

    get cache(): Collection<string, Channel>;

    set(id: string, channel: ChannelData | Channel): Channel;

    fetch(type: string): Promise<Channel>;
    fetchAll(): Promise<Collection<string, Channel>>;

    //create(payload): Promise<Channel>
    // update(payload): Promise<Channel>

    delete(type: string): Promise<Collection<string, Channel>>
    deleteAll(): Promise<void>;

    create(payload: ChannelData): Promise<Channel>;
}