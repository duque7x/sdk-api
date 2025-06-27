import { REST } from "../rest/REST"

type ChannelData = {
    id: string;
    type: string;
}

export class Channel {
    constructor(data: ChannelData, rest: REST, field: string, guildId: string, manager)

    id: string;
    type: string;

    setId(id: string): Promise<this>;

    delete(): Promise<void>;
}