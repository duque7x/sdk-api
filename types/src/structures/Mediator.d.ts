import { MediatorData } from "../../..";
import { REST } from "../rest/REST";
export class Mediator {
    id: string;
    name: string;
    paymentLinks: string[];

    guildId: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(data: MediatorData, rest: REST, guildId: string);
    get data(): MediatorData;

    delete(): Promise<void>;

    setLinks(link: string): Promise<string[]>;
    removeLink(link: string): Promise<string[]>;

    /**
     * Returns a string representation of this structure
     */
    toString(): string;
}