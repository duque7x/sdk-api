const { Collection } = require("../structures/Collection");

exports.BaseManager = class {
    constructor(data) {
        this.data = data;
        this.cache = new Collection(data);
    }

    toJSON() {
        return this.cache.toJSON();
    }
    toArray() {
        return this.cache.toArray();
    }
}