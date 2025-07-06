exports.isIterable = (obj) => obj != null && typeof obj[Symbol.iterator] === 'function';
