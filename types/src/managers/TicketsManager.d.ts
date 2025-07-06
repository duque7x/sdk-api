import { REST } from "./REST";
import { Collection } from "../structures/Collection";
import { TicketCategory, TicketData, TicketsConfiguration } from "../../../index";
import { Ticket } from "../structures/Ticket";

/**
 * Routes handler for ticket-related API operations.
 */
export class TicketsManager {
  /**
   * Creates a new BetsManager instance.
   * @param rest - An instance of the REST client.
   */
  constructor(data: TicketData[], rest: REST);

  /**
   * @returns Collection of tickets
   */
  get cache(): Collection<string, Ticket>;

  /**
   * Set a ticket in the cache
   * @param id The ticket's ide
   * @param ticket The ticket data to set
   */
  set(id: string, ticket: TicketData): Collection<string, Ticket>;
  set(id: string, ticket: Ticket): Collection<string, Ticket>;

  /**
   * Creates a new ticket.
   * @param creatorId - The creatorId to create the ticket with.
   * @param type - The type to create the ticket with.
   * @param channelId - The channelId of the ticket
   * @returns A promise resolving to the created ticket data.
   */
  create(creatorId: string, type: string, channelId?: string): Promise<Ticket>;

  /**
   * Adds a category to the guild in the case
   * @param type The type of the category
   * @param description The description of the category
   * @param emoji The emoji of the cateegory
   * @param alias The 'short-name' for this category
   */
  addCategory(type: string, description: string, emoji: string, alias: string): Promise<TicketCategory>;

  /**
   * Updates a certain category in the guild
   * @param type The type of the category
   * @param payload The new data to update the category with
   */
  async updateCategory(type: string, payload: TicketCategory): Promise<TicketCategory>;

  /**
   * Removes a category in the guild of the case
   * @param type The type of the category
   */
  removeCategory(type: string): Promise<TicketsConfiguration>;

  /**
   * Fetches a ticket by its ID.
   * @param id - The unique ID of the ticket.
   * @returns A promise resolving to the ticket data.
   */
  fetch(id: string): Promise<Ticket>;

  /**
   * Fetches all tickets in a guild
   * @returns Collection of tickets
   */
  fetchAll(): Promise<Collection<string, Ticket>>;

  /**
   * Delets a ticket by its ID.
   * @param id - The unique ID of the ticket.
   * @returns Promise void
   */
  delete(id: string): Promise<void>;

  /**
   * Delets all tickets in a guild
   * @returns Promise void
   */
  deleteAll(): Promise<boolean>;
}
