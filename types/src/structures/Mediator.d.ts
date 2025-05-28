import { REST } from "../rest/REST";

declare type MediatorData = {
    id: string;
    name: string;
    paymentLinks: string[];
    createdAt: Date;
}

export class Mediator {
    id: string;
    name: string;
    paymentLinks: string[];
    createdAt: Date;
    guildId: string;

    constructor(data: MediatorData, rest: REST, guildId: string);
    get data(): MediatorData;

    delete(): Promise<void>;

    setLinks(link: string): Promise<string[]>;
    removeLink(link: string): Promise<string[]>;
}