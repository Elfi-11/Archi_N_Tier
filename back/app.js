const knex = require('knex');
const config = require('./knexfile');

console.log('Initialisation de la connexion à la base de données...');

const db = knex(config.development);

// Test de la connexion
db.raw('SELECT 1')
.then(() => {
    console.log('Connexion à la base de données réussie!');
})
.catch((error) => {
    console.error('Erreur de connexion à la base de données:', error);
});

module.exports = db;



