# Archi_N_Tier

Par Marina Estanco

## Description
Ce projet est une application de quiz construite avec Node.js pour le backend, Express pour la gestion des requêtes HTTP, SQLite comme base de données, et React pour le frontend. 

## Prérequis
Assurez-vous d'avoir installé les éléments suivants sur votre machine :

- [Node.js](https://nodejs.org/) (version 14 ou supérieure)
- [npm](https://www.npmjs.com/) (installé avec Node.js)
- [Git](https://git-scm.com/) (pour la gestion du code source)

## Structure du projet

Archi_N_Tier/ ├── back/ # Dossier pour le backend │ 
                  ├── app.js # Point d'entrée de l'application backend │ 
              ├── package.json # Dépendances du backend 
              │ └── ... # Autres fichiers et dossiers backend 
              ├── front/ # Dossier pour le frontend │ 
                  ├── src/ # Dossier source de l'application React │ 
                  ├── public/ # Dossier public de l'application React │ 
              ├── package.json # Dépendances du frontend │ 
                  └── ... # Autres fichiers et dossiers frontend 
              └── .gitignore # Fichier pour ignorer les fichiers non suivis


## Installation

### Backend

1. Ouvrez un terminal dans le dossier `back`.
2. Installez les dépendances :

   ```bash
   npm install

3. Démarer le back : 
   ```bash
   npm start


## Installation

### Frontend

1. Ouvrez un terminal dans le dossier `frontend`.
2. Installez les dépendances :

   ```bash
   npm install

3. Démarer le front : 
   ```bash
   npm start


## Utilisation
Une fois le backend et le frontend en cours d'exécution, vous pouvez interagir avec l'application en ouvrant votre navigateur à l'adresse du frontend. Les requêtes envoyées par le frontend seront traitées par le backend, qui interagira avec la base de données SQLite pour stocker et récupérer les données.