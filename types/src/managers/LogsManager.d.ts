import { REST } from "../rest/REST";
import { Collection } from "../structures/Collection";

export interface LogMessage {
    content: string |  { data: ArrayBuffer, type: string };
    userId: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
}

export type Messages = Collection<string, LogMessage>;

interface LogData {
    messages: Messages;
}

export declare class LogsManager {
    messages: Messages;

    constructor(data: LogData, rest: REST);
    addMessage(content: string | Buffer<any>, type: string | 'text' | 'image' | 'image/png' | 'image/jpg' | 'image/jpeg', userId: string): Promise<Messages>;
}