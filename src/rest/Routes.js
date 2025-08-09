module.exports = {
    //base: "https://duquedev.up.railway.app/api/v1",
    base: "http://localhost:3000/api/v1",

    field: field => `/${field}`,
    fields: (...field) => field.join("/"),

    guilds: {
        get: id => `/guilds/${id}`,
        getAll: () => `/guilds`,

        create: () => `/guilds`,

        delete: id => `/guilds/${id}`,
        deleteAll: () => `/guilds`,
        resource: (resourceName, guildId) => `/guilds/${guildId}/${resourceName}`,

        mediators: {
            getAll: guildId => `/guilds/${guildId}/mediators`,
            get: (userId, guildId) => `/guilds/${guildId}/mediators/${userId}`,

            create: guildId => `/guilds/${guildId}/mediators`,
            update: (userId, guildId) => `/guilds/${guildId}/mediators/${userId}`,

            delete: (userId, guildId) => `/guilds/${guildId}/mediators/${userId}`,
            deleteAll: guildId => `/guilds/${guildId}/mediators`,

            resource: (guildId, userId, ...resources) => `/guilds/${guildId}/mediators/${userId}/${resources.join("/")}`,
        },
        tickets: {
            getAll: guildId => `/guilds/${guildId}/tickets`,
            get: (ticketId, guildId) => `/guilds/${guildId}/tickets/${ticketId}`,

            create: guildId => `/guilds/${guildId}/tickets`,
            update: (ticketId, guildId) => `/guilds/${guildId}/tickets/${ticketId}`,

            delete: (ticketId, guildId) => `/guilds/${guildId}/tickets/${ticketId}`,
            deleteAll: guildId => `/guilds/${guildId}/tickets`,

            resource: (guildId, ticketId, ...resources) => `/guilds/${guildId}/tickets/${ticketId}/${resources.join("/")}`,
        },
        users: {
            getAll: guildId => `/guilds/${guildId}/users`,
            get: (userId, guildId) => `/guilds/${guildId}/users/${userId}`,

            create: guildId => `/guilds/${guildId}/users`,
            update: (userId, guildId) => `/guilds/${guildId}/users/${userId}`,

            delete: (userId, guildId) => `/guilds/${guildId}/users/${userId}`,
            deleteAll: guildId => `/guilds/${guildId}/users`,

            resource: (userId, resourceName, guildId) => `/guilds/${guildId}/users/${userId}/${resourceName}`,
        },
        betUsers: {
            getAll: guildId => `/guilds/${guildId}/betusers`,
            get: (userId, guildId) => `/guilds/${guildId}/betusers/${userId}`,

            create: guildId => `/guilds/${guildId}/betusers`,
            update: (userId, guildId) => `/guilds/${guildId}/betusers/${userId}`,

            delete: (userId, guildId) => `/guilds/${guildId}/betusers/${userId}`,
            deleteAll: guildId => `/guilds/${guildId}/betusers`,
            resource: (userId, resourceName, guildId) => `/guilds/${guildId}/betusers/${userId}/${resourceName}`,
        },
        matches: {
            getAll: guildId => `/guilds/${guildId}/matches`,
            get: (matchId, guildId) => `/guilds/${guildId}/matches/${matchId}`,

            create: guildId => `/guilds/${guildId}/matches`,
            update: (matchId, guildId) => `/guilds/${guildId}/matches/${matchId}`,

            delete: (matchId, guildId) => `/guilds/${guildId}/matches/${matchId}`,
            deleteAll: guildId => `/guilds/${guildId}/matches`,

            resource: (matchId, resourceName, guildId) => `/guilds/${guildId}/matches/${matchId}/${resourceName}`,
        },
        bets: {
            getAll: guildId => `/guilds/${guildId}/bets`,
            get: (betId, guildId) => `/guilds/${guildId}/bets/${betId}`,

            create: guildId => `/guilds/${guildId}/bets`,
            update: (betId, guildId) => `/guilds/${guildId}/bets/${betId}`,

            delete: (betId, guildId) => `/guilds/${guildId}/bets/${betId}`,
            deleteAll: (guildId) => `/guilds/${guildId}/bets/`,

            resource: (guildId, ...args) => `/guilds/${guildId}/bets/${args.join("/")}`,
        },
        shop: {
            products: {
                get: (productId, guildId) => `/guilds/${guildId}/shop/products/${productId}`,
                getAll: guildId => `/guilds/${guildId}/shop/products`,

                create: (guildId) => `/guilds/${guildId}/shop/products/`,
                update: (productId, guildId) => `/guilds/${guildId}/shop/products/${productId}`,

                delete: (productId, guildId) => `/guilds/${guildId}/shop/products/${productId}`,
                deleteAll: (guildId) => `/guilds/${guildId}/shop/products`,

                resource: (productId, guildId, ...args) => `/guilds/${guildId}/shop/products/${productId}/${args.join("/")}`,
            },
            update: guildId => `/guilds/${guildId}/shop`,
            set: guildId => `/guilds/${guildId}/shop`,

            delete: (guildId) => `/guilds/${guildId}/shop`,
            resource: (guildId, ...args) => `/guilds/${guildId}/shop/${args.join("/")}`,
        },


        channels: {
            get: (channelType, guildId) => `/guilds/${guildId}/channels/${channelType}`,
            getAll: (channelType, guildId) => `/guilds/${guildId}/channels`,

            create: guildId => `/guilds/${guildId}/channels`,
            update: (channelType, guildId) => `/guilds/${guildId}/channels/${channelType}`,

            delete: (channelType, guildId) => `/guilds/${guildId}/channels/${channelType}`,
            deleteAll: (guildId) => `/guilds/${guildId}/channels`,
            resource: (guildId, channelType, ...args) => `/guilds/${guildId}/channels/${channelType}/${args.join("/")}`,
        },
    }
}