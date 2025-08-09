import { TicketData, DailyWins } from "../../..";
import { LogsManager } from "../managers/LogsManager";
import { REST } from "../rest/REST";

export class Ticket {
  /**
   * The person who closed the ticket
   */
  closedById: string;
  /**
   * The id of the ticket
   */
  id: string;

  channelId: string;
  /**
   * The id of the creator
   */
  creatorId: string;

  /**
   * The admin of the ticket
   */
  adminId: string;

  /**
   * The rating of the ticket
   */
  customerRating: number;

  /**
   * The type of the ticket
   */
  type: string;

  /**
   * The status of the ticket
   */
  status: 'on' | 'off';

  /**
   * This is the messages of the ticket!
   */
  messages: LogsManager;


  /**
  * The date of the creation of the ticket
  */
  createdAt: Date;

  /**
   * The last date where the ticket was updated
   */
  updatedAt: Date;

  constructor(data: TicketData, rest: REST, guildId: string);

  /**
   * Sets the channel id!
   * @param channelId The channel id
   */
  setChannelId(channelId: string): Promise<Ticket>;
  /**
   * Sets the admin id for this ticket
   * @param adminId The attendant's id
   */
  setAdminId(adminId: string): Promise<Ticket>;

  /**
   * Set the admin whom closed the ticket
   * @param closedById The attendant who closed it
   */
  setClosedById(closedById: string): Promise<Ticket>;

  /**
   * Set the rating of the attended
   * @param rating The rating from 0-10
   */
  setCustomerRating(rating: number): Promise<Ticket>;

  /**
   * Set the type of the ticket
   * @param type The type of the ticket
   */
  setType(type: string): Promise<Ticket>;

  /**
   * Sets the status for this ticket
   * @param status The new status to be used
   * @default 'on'
   */
  setStatus(status: 'on' | 'off'): Promise<Ticket>;

  /**
   * Fetches the ticket and returns updated data
   */
  fetch(): Promise<Ticket>;

  /**
   * Delete this ticket
   */
  delete(): Promise<boolean>;

  /**
   * Returns a string representation of this structure
   */
  toString(): string;
}
