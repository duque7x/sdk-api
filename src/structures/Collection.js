// src/defaults/Collection.js
class Collection extends Map {
    constructor(entries) {
        super(entries);
    }
    at(index) {
        if (index < 0 || index >= this.size) {
            return undefined; 
        }

        let i = 0;
        for (let [key, value] of this) {
            if (i === index) {
                return value;
            }
            i++;
        }
    }
    get first() {
        return this.values().next().value;
    }
    get last() {
        return [...this.values()].at(-1);
    }
    get length() {
        return this.toArray().length;
    }
    find(predicate) {
        for (const [key, value] of this) {
            if (predicate(value, key, this)) return value;
        }
        return undefined;
    }
    filter(predicate) {
        const results = new Collection();
        for (const [key, value] of this) {
            if (predicate(value, key, this)) results.set(key, value);
        }
        return results;
    }
    map(callback) {
        return [...this].map(([key, val]) => callback(val, key, this));
    }
    toArray() {
        return [...this.values()];
    }
    toJSON() {
        return this.map((val) => val.toJSON ? val.toJSON() : val);
    }
}

module.exports = { Collection };
