import { REST } from "../rest/REST";

declare type MediatorData = {
    id: string;
    name: string;
    paymentLinks: string[];
    createdAt: Date;
    updatedAt: Date;
}

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
}