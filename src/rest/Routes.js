module.exports = {
    base: "https://duquedev.up.railway.app/api/v1",

    //base: "http://localhost:3000/api/v1",

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
    }
}