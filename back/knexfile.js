module.exports = {
development: {
    client: 'better-sqlite3',
    connection: {
    filename: './database/quiz.sqlite'
    },
    useNullAsDefault: true,
    migrations: {
    directory: './database/migrations'
    },
    seeds: {
    directory: './database/seeds'
    }
}
}; 