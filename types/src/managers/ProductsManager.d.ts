import { REST } from "../rest/REST";
import { ProductData } from "../../../index";
import { Collection } from "../structures/Collection";
import { Product } from "../structures/Product";

export class ProductsManager {
  /**
   * Creates a new ProductsManager instance.
   * @param data The bet products in a given guild
   * @param rest An instance of the REST client
   */
  constructor(data: ProductData[], rest: REST);
  constructor(data: Product, rest: REST);

  /**
   * Creates a product in a guild
   * Returns the product if already created
   * @param payload 
   */
  create(payload: ProductData): Promise<Product>;

  /**
   * Returns a collection of products
   */
  get cache(): Collection<string, Product>;

  /**
   * Sets an product into the cache
   * @param id The product's id to set
   * @param product the product's data to set
   */
  set(id: string, product: ProductData): void;
  set(id: string, product: Product): void;

  /**
   * Fetches a product from the api
   * @param id The product's id
   */
  fetch(id: string): Promise<Product>;

  /**
   * Fetches all available products in a given guild
   */
  fetchAll(): Promise<Collection<string, Product>>;

  /**
   * Deletes a product with the given id
   * @param id The product's id to delete
   */
  delete(id: string, type: "bet" | "match"): Promise<void>;

  /**
   * Deletes all product in a guild
   */
  deleteAll(): Promise<boolean>;
}
