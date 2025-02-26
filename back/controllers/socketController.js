const questionController = require('./questionController');
const themeController = require('./themeController');
const Questions = require('../models/questions');

module.exports = (io) => {
    // Map pour stocker les joueurs par salle
    const rooms = new Map();
    // Map pour stocker les questions par salle
    const gameStates = new Map();

    const broadcastRoomUpdate = (roomCode) => {
        const roomPlayers = rooms.get(roomCode);
        if (roomPlayers) {
            console.log(`📢 Broadcasting to room ${roomCode}:`, roomPlayers);
            io.in(roomCode).emit('playerUpdate', roomPlayers);
        }
    };

    io.on('connection', (socket) => {
        console.log('🔌 Nouvelle connexion:', socket.id);

        // Écoute de l'événement joinRoom
        socket.on('joinRoom', async (data) => {
            const { userName, roomCode, isHost } = data;
            console.log('👋 Joueur rejoint:', { userName, roomCode, isHost });
            
            // Rejoindre la salle
            socket.join(roomCode);
            
            // Récupérer ou créer la liste des joueurs
            let players = rooms.get(roomCode) || [];
            console.log('Joueurs actuels:', players);
            
            // Ajouter le nouveau joueur
            players.push({
                id: socket.id,
                name: userName,
                isHost: isHost
            });
            
            // Sauvegarder la liste mise à jour
            rooms.set(roomCode, players);
            console.log('Nouvelle liste des joueurs:', players);
            
            // Envoyer la mise à jour à tous les clients dans la salle
            io.to(roomCode).emit('playerUpdate', players);
            
            // Si c'est l'hôte, on envoie les thèmes immédiatement après la confirmation
            if (isHost) {
                try {
                    const themes = await themeController.getAllThemes();
                    console.log('Envoi des thèmes à l\'hôte:', themes);
                    socket.emit('themes', themes);
                } catch (error) {
                    console.error('❌ Erreur thèmes:', error);
                }
            }

            socket.emit('joinConfirmed', {
                roomCode,
                players
            });
        });

        socket.on('disconnect', () => {
            console.log('👋 Déconnexion:', socket.id);
            
            // Nettoyer les salles lors de la déconnexion
            for (const [roomCode, players] of rooms.entries()) {
                const updatedPlayers = players.filter(p => p.id !== socket.id);
                if (updatedPlayers.length !== players.length) {
                    if (updatedPlayers.length > 0) {
                        rooms.set(roomCode, updatedPlayers);
                        io.to(roomCode).emit('playerUpdate', updatedPlayers);
                    } else {
                        rooms.delete(roomCode);
                        gameStates.delete(roomCode);
                    }
                }
            }
        });

        // Gestion des thèmes
        socket.on('requestThemes', async () => {
            try {
                console.log('\n=== DEMANDE DE THÈMES ===');
                console.log('Par:', socket.id);
                const themes = await themeController.getAllThemes();
                console.log('Thèmes trouvés:', themes);
                socket.emit('themes', themes);
                console.log('Thèmes envoyés au client');
            } catch (error) {
                console.error('Erreur lors de la récupération des thèmes:', error);
                socket.emit('error', 'Erreur lors de la récupération des thèmes');
            }
        });

        socket.on('checkRoom', (roomCode) => {
            const roomPlayers = rooms.get(roomCode);
            socket.emit('roomStatus', {
                roomCode,
                players: roomPlayers || []
            });
        });

        // Gestion du démarrage du jeu
        socket.on('startGame', async ({ themeId, roomCode }) => {
            try {
                console.log('🎮 Démarrage du jeu - Thème:', themeId);
                const questions = await questionController.getQuestionsByThemeId(themeId);
                
                if (!questions || questions.length === 0) {
                    socket.emit('error', 'Aucune question trouvée pour ce thème');
                    return;
                }

                // Sauvegarder l'état du jeu pour cette salle
                gameStates.set(roomCode, {
                    questions,
                    currentIndex: 0,
                    scores: {}
                });

                // Envoyer la première question
                socket.emit('gameStarted', {
                    questions: questions[0],
                    total: questions.length
                });
            } catch (error) {
                console.error('❌ Erreur jeu:', error);
                socket.emit('error', 'Erreur lors du démarrage du jeu');
            }
        });

        // Gestion des questions
        socket.on('requestQuestions', async ({ themeId }) => {
            try {
                const questions = await questionController.getQuestionsByThemeId(themeId);
                socket.emit('questions', questions);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        });

        // Gestion des réponses
        socket.on('submitAnswer', async ({ questionId, answer, roomCode }) => {
            try {
                const isCorrect = await questionController.checkAnswer(questionId, answer);
                socket.emit('answerResult', {
                    correct: isCorrect,
                    questionId,
                    answer
                });

                // Attendre un peu avant de passer à la question suivante
                setTimeout(() => {
                    const gameState = gameStates.get(roomCode);
                    if (gameState) {
                        gameState.currentIndex++;
                        
                        // S'il reste des questions
                        if (gameState.currentIndex < gameState.questions.length) {
                            const nextQuestion = gameState.questions[gameState.currentIndex];
                            io.to(roomCode).emit('nextQuestion', {
                                question: nextQuestion,
                                index: gameState.currentIndex
                            });
                        } else {
                            // Fin du jeu
                            io.to(roomCode).emit('gameOver', gameState.scores);
                            gameStates.delete(roomCode);
                        }
                    }
                }, 2000); // Attendre 2 secondes avant la prochaine question

            } catch (error) {
                console.error('❌ Erreur réponse:', error);
            }
        });
    });
};
