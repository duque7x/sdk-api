// myCollection.d.ts
export declare class Collection<K, V> extends Map<K, V> {
  constructor(entries?: readonly (readonly [K, V])[]);

  /**
   * @returns the value at given index
   * @param index Value being accessed
   */
  at(index: number): V;

  /**
   * @returns the user at first
   */
  first(): V;

  /**
   * @returns the user at last
   */
  last(): V;

  /**
   *
   * @param predicate This what the critiria of what to be found
   */
  find(
    predicate: (value: V, key: K, collection: this) => boolean
  ): V | undefined;

  /**
   *
   * @param predicate This what the critiria of what to be filtered
   */
  filter(
    predicate: (value: V, key: K, collection: this) => boolean
  ): Collection<K, V>;

  /**
   *
   * @param callback What is going to be called each time
   */
  map<T>(callback: (value: V, key: K, collection: this) => T): T[];

  /**
   * @returns the collection as an array
   */
  toArray(): V[];

  /**
   * @returns the collection to JSON
   */
  toJSON(): Record<string, unknown>;

  /**
   * @returns number of elements in the collection
   */
  get length(): number;

  /**
   * Returns a string representation of this structure
   */
  toString(): string;
}
