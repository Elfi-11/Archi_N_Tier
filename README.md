# Quiz en Temps Réel

## Description
Application de quiz en temps réel permettant aux utilisateurs de répondre à des questions sur différents thèmes. Les réponses sont évaluées instantanément et les scores sont calculés en fonction du temps de réponse.

## Stack Technique

### Frontend (Port 3000)
- **React** : Bibliothèque JavaScript pour construire l'interface utilisateur
  - Gère l'état de l'application avec useState et useEffect
  - Affiche les questions et réponses de manière dynamique
  - Gère l'interaction utilisateur et les événements
  - Communique avec le backend via Socket.IO Client

### Backend (Port 3001)
- **Socket.IO** : Bibliothèque pour la communication en temps réel
  - Permet la communication bidirectionnelle client-serveur
  - Gère les événements en temps réel :
    * Connexion/déconnexion des joueurs
    * Envoi des questions
    * Réception des réponses
    * Mise à jour des scores
  - Maintient une connexion persistante avec les clients

### Base de données
- **SQLite** avec **better-sqlite3**
  - Base de données SQL légère et sans serveur
  - Stocke :
    * Questions et réponses
    * Thèmes des questions
    * Scores (optionnel)
  - Avantages :
    * Pas de serveur de base de données séparé
    * Fichier unique facile à sauvegarder
    * Performances optimales pour les petites applications

### ORM et Middleware
- **Knex.js** : Query builder SQL
  - Gère les migrations de base de données :
    * Création des tables
    * Modifications de structure
  - Simplifie les requêtes SQL avec une API JavaScript
  - Permet le seeding des données de test
  - Organise la structure de la base de données

- **CORS** : Middleware de sécurité
  - Permet la communication cross-origin entre frontend et backend
  - Configure les autorisations d'accès HTTP
  - Essentiel car frontend (3000) et backend (3001) sur des ports différents

## 🔧 Installation

### Backend
```bash
# Naviguer vers le dossier backend
cd back

# Installer les dépendances
npm install

# Configurer la base de données
npx knex migrate:latest
npx knex seed:run

# Démarrer le serveur
npm start
```

### Frontend
```bash
# Naviguer vers le dossier frontend
cd front

# Installer les dépendances
npm install

# Démarrer l'application React
npm start
```

## 🌐 Utilisation
1. Ouvrez votre navigateur et accédez à `http://localhost:3000`
2. L'API backend est accessible sur `http://localhost:3001`
3. Les endpoints disponibles :
   - GET `/api/questions` : Liste toutes les questions
   - GET `/api/questions/:id` : Récupère une question spécifique

## 🔌 Socket.IO Events
- `connection` : Établit la connexion avec le serveur
- `requestQuestions` : Demande la liste des questions
- `submitAnswer` : Soumet une réponse
- `answerResult` : Reçoit le résultat d'une réponse

## 🤝 Contribution
Les contributions sont les bienvenues ! Pour contribuer :
1. Forkez le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📝 License
Ce projet est sous licence ISC.

## 📞 Contact
Marina Estanco - [GitHub](https://github.com/Elfi-11)

## 🙏 Remerciements
- Merci à tous les contributeurs
- Inspiré par les meilleures pratiques de développement web moderne