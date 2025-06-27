import { BasicChannelData } from "../../..";
import { REST } from "../rest/REST"

export class Channel {
    constructor(data: BasicChannelData, rest: REST, field: string, guildId: string, manager)

    id: string;
    type: string;

    setId(id: string): Promise<this>;

    delete(): Promise<void>;

    /**
     * Returns a string representation of this structure
     */
    toString(): string;
}