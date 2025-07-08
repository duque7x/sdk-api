import { BasicChannelData, GroupedChannelData, Guild } from "../../..";
import { GroupedChannelManager } from "../../../src/managers/groupedchannel/GroupedChannelManager";
import { REST } from "../rest/REST"

export class GroupedChannel {
    constructor(data: GroupedChannelData, rest: REST)

    ids: string[];
    type: string;
    guild: Guild;
    manager: GroupedChannelManager;


    fetch(): Promise<GroupedChannel>;

    setIds(ids: string[]): Promise<GroupedChannel>;
    addId(id: string): Promise<GroupedChannel>;
    removeId(id: string): Promise<GroupedChannel>;

    delete(): Promise<void>;

    /**
     * Returns a string representation of this structure
     */
    toString(): string;
}