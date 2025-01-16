const Database = require('better-sqlite3');

// Ouvrir la base de données quiz.sqlite dans le dossier bdd
const dbPath = './database/quiz.sqlite';

const deleteDb = () => {
    const db = new Database(dbPath);
    db.prepare('DELETE FROM questions WHERE id = 3').run();
    console.log('Question supprimée avec succès.');
};

deleteDb();




