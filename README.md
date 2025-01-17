# Archi_N_Tier - Quiz Application

Par Marina Estanco

## 📝 Description
Une application de quiz interactive en temps réel construite avec une architecture N-tiers moderne. Cette application permet aux utilisateurs de participer à des quiz avec des questions à choix multiples, avec des mises à jour en temps réel grâce à Socket.IO.

## 🛠 Technologies Utilisées
- **Backend**
  - Node.js
  - Express.js
  - SQLite (avec Knex.js)
  - Socket.IO
- **Frontend**
  - React.js
  - Socket.IO-client
  - CSS Modules

## 🚀 Fonctionnalités
- Quiz interactif en temps réel
- Questions à choix multiples
- Feedback instantané sur les réponses
- Système de score
- Interface utilisateur responsive

## 📋 Prérequis
- Node.js (v14 ou supérieure)
- npm (v6 ou supérieure)
- Git

## 📁 Structure du Projet
```
Archi_N_Tier/
├── back/                  # Backend
│   ├── database/         # Base de données SQLite et migrations
│   │   ├── migrations/   # Fichiers de migration Knex
│   │   └── seeds/       # Données de test
│   ├── models/          # Modèles de données
│   ├── app.js           # Configuration de l'application
│   ├── index.js         # Point d'entrée
│   └── knexfile.js      # Configuration de Knex
└── front/               # Frontend React
    ├── public/          # Fichiers statiques
    └── src/             # Code source React
        ├── components/  # Composants React
        └── styles/     # Fichiers CSS
```

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