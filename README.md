# Quiz Master - Application de Quiz en Temps Réel

## Description
Application de quiz en temps réel permettant aux utilisateurs de répondre à des questions sur différents thèmes. Les réponses sont évaluées instantanément et les scores sont calculés en fonction du temps de réponse, avec un système de points dynamique qui récompense la rapidité.

## Fonctionnalités

- **Interface responsive** adaptée à tous les écrans
- **Système de salles** permettant à plusieurs joueurs de s'affronter
- **Sélection de thèmes** pour personnaliser chaque partie
- **Système de points dynamique** basé sur le temps de réponse (20 secondes pour respecter la notation):
  - 10 points pour une réponse correcte dans les 5 premières secondes
  - 5 points pour une réponse correcte entre 5 et 10 secondes
  - 2 points pour une réponse correcte après 10 secondes et avant la fin du temps
  - 0 point pour une réponse incorrecte
- **Barre de progression animée** indiquant le temps restant
- **Affichage des scores en temps réel**
- **Écran de fin de partie** avec classement et célébration du gagnant
- **Animation de confettis** pour le vainqueur

## Stack Technique

### Frontend (Port 3000)
- **React** : Bibliothèque JavaScript pour construire l'interface utilisateur
  - Gestion d'état avec useState, useEffect et useCallback
  - Composants fonctionnels et hooks personnalisés
  - Affichage dynamique des questions et réponses
- **NextUI** : Bibliothèque de composants UI modernes
- **TailwindCSS** : Framework CSS utilitaire pour le styling
- **Socket.IO Client** : Communication en temps réel avec le serveur
- **Framer Motion** : Animations fluides de l'interface

### Backend (Port 3001)
- **Node.js** : Environnement d'exécution JavaScript côté serveur
- **Express** : Framework web minimaliste
- **Socket.IO** : Bibliothèque pour la communication en temps réel
  - Gestion des événements en temps réel :
    * Connexion/déconnexion des joueurs
    * Envoi des questions
    * Réception et évaluation des réponses
    * Calcul et mise à jour des scores
    * Synchronisation du timer entre tous les joueurs
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
  - Gère les migrations de base de données
  - Simplifie les requêtes SQL avec une API JavaScript
  - Permet le seeding des données de test
- **CORS** : Middleware de sécurité
  - Permet la communication cross-origin entre frontend et backend

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

# Installer Nextui et Tailwind
npm install @nextui-org/react framer-motion
npm install -D tailwindcss postcss autoprefixer

# Démarrer l'application React
npm start
```

## 🌐 Utilisation
1. Ouvrez votre navigateur et accédez à `http://localhost:3000`
2. Entrez votre nom d'utilisateur
3. Créez une nouvelle partie ou rejoignez une partie existante avec un code
4. Si vous êtes l'hôte, sélectionnez un thème et démarrez la partie
5. Répondez aux questions le plus rapidement possible pour maximiser vos points
6. Consultez le classement final à la fin de la partie

## 🔌 Socket.IO Events
- `connection` : Établit la connexion avec le serveur
- `joinRoom` : Rejoint ou crée une salle de jeu
- `playerUpdate` : Mise à jour de la liste des joueurs
- `requestQuestions` : Demande la liste des questions pour un thème
- `startGame` : Démarre la partie
- `submitAnswer` : Soumet une réponse
- `answerResult` : Reçoit le résultat d'une réponse
- `timeUpdate` : Mise à jour du temps restant
- `nextQuestion` : Passage à la question suivante
- `gameOver` : Fin de la partie et affichage des scores

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
- Projet réalisé dans le cadre du cours Architecture N-Tiers