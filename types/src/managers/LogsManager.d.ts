import { REST } from "../rest/REST";
import { Collection } from "../structures/Collection";

export type Messages = Collection<string, LogMessage>;

interface LogData {
    messages: Messages;
}
type AllowedTypes = '.png' | '.jpg' | '.jpeg' | '.gif' | '.webp' | 'text';

export declare class LogsManager {
    /**
     * The messages in this log State
     */
    messages: Messages;

    /**
     * Creates a new LogsManager instance.
     * @param data The logs | message in a given structure
     * @param rest An instance of the REST client
     */
    constructor(data: LogData, rest: REST);

    /**
     * Add a message to a structure
     * @param content the message data can be an image
     * @param userId The author of the message
     * @param extension If message is an image extension is needed
     * @default extension="txt"
     */
    addMessage(
        content: Buffer<any> | string,
        userId: string,
        type?: AllowedTypes
    ): Promise<Messages>;
}