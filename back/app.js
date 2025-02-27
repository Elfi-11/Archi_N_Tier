const knex = require('knex');
const config = require('./knexfile');

let db;

try {
    db = knex(config.development);
    
    // Test de connexion immédiat avec async/await
    (async () => {
        await db.raw('SELECT 1');
        console.log('✅ Base de données connectée');
    })();
} catch (error) {
    console.error('❌ Erreur de connexion BD:', error);
    process.exit(1); // Arrêter l'application si la BD n'est pas accessible
}

module.exports = db;



