const Database = require('better-sqlite3');
const fs = require('fs');
// Ouvrir la base de données quiz.sqlite dans le dossier bdd
const dbPath = './database/quiz.sqlite';

// Fonction pour initialiser la base de données
const initDb = () => {


    // Vérifie si le fichier existe avant de le supprimer
    if (fs.existsSync(dbPath)) {
        // Supprimer le fichier de la base de données
        fs.unlink(dbPath, (err) => {
            if (err) {
                console.error("Erreur lors de la suppression de la base de données : ", err);
            } else {
                console.log('Base de données quiz.sqlite supprimée avec succès.');
            }
        });
    } else {
        console.log('Le fichier de base de données n\'existe pas.');
    }

    try {
        // Ouvre la base de données
        const db = new Database(dbPath);

        // Créer une table si elle n'existe pas
        db.exec(`CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT,
            reponse1 TEXT,
            reponse2 TEXT,
            reponse3 TEXT,
            reponse4 TEXT,
            bonne_reponse INTEGER
        )`);

        console.log("Table 'questions' créée ou déjà existante.");

        // Fonction pour insérer une question
        const insertQuestion = (question, reponse1, reponse2, reponse3, reponse4, bonne_reponse) => {
            const stmt = db.prepare(`INSERT INTO questions (question, reponse1, reponse2, reponse3, reponse4, bonne_reponse) 
                        VALUES (?, ?, ?, ?, ?, ?)`);
            
            const result = stmt.run(question, reponse1, reponse2, reponse3, reponse4, bonne_reponse);
            console.log(`Une nouvelle question a été insérée avec l'ID ${result.lastInsertRowid}`);
        };

        
        // Insérer les questions dans la base de données
        insertQuestion("Quel est le plus grand organe du corps humain ?", "Le cœur", "La peau", "Le foie", "Les poumons", 2);
        insertQuestion("Quelle est la principale fonction des globules rouges ?", "Combattre les infections", "Transporter l'oxygène", "Coaguler le sang", "Produire des anticorps", 2);
        insertQuestion("Quel est le principal muscle de la respiration ?", "Le diaphragme", "Le muscle droit de l'abdomen", "Le muscle pectoral", "Le muscle intercostal", 1);
        insertQuestion("Quel signe clinique est souvent associé à l'hypertension artérielle ?", "Vertiges", "Évanouissements", "Maux de tête", "Fatigue", 3);
        insertQuestion("Quelle structure du système nerveux central est responsable de la coordination des mouvements ?", "Le cortex cérébral", "Le cervelet", "Le tronc cérébral", "La moelle épinière", 2);
        insertQuestion("Quel est le principal signe clinique de l'infarctus du myocarde ?", "Douleur thoracique", "Essoufflement", "Nausées", "Palpitations", 1);
        insertQuestion("Quelle hormone est principalement produite par le pancréas pour réguler la glycémie ?", "Insuline", "Glucagon", "Adrénaline", "Cortisol", 1);
        insertQuestion("Quel est le principal symptôme de l'asthme ?", "Toux", "Difficulté à respirer", "Douleur thoracique", "Écoulement nasal", 2);
        insertQuestion("Quelle est la fonction principale des reins ?", "Produire des hormones", "Éliminer les déchets du sang", "Réguler la température corporelle", "Absorber les nutriments", 2);
        insertQuestion("Quel est le signe clinique typique d'une réaction allergique ?", "Éruption cutanée", "Frissons", "Fièvre", "Mal de tête", 1);

        // Fermer la base de données
        db.close();
        console.log('Connexion à la base de données fermée.');

    } catch (err) {
        console.error('Erreur lors de l\'initialisation de la base de données:', err);
    }
};

// Initialiser la base de données
initDb();



