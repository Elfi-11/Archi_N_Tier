const questionController = require('./questionController');
const themeController = require('./themeController');

module.exports = (io) => {
    const rooms = new Map();
    const gameStates = new Map();

    io.on('connection', (socket) => {
        socket.on('joinRoom', async (data) => {
            const { userName, roomCode, isHost } = data;
            
            // Vérifier si le joueur est déjà dans la salle
            let players = rooms.get(roomCode) || [];
            const existingPlayerIndex = players.findIndex(p => p.name === userName);
            
            // Si le joueur existe déjà, le supprimer
            if (existingPlayerIndex !== -1) {
                players = players.filter(p => p.name !== userName);
            }
            
            // Ajouter le joueur à la salle
            socket.join(roomCode);
            players.push({ id: socket.id, name: userName, isHost });
            rooms.set(roomCode, players);
            
            // Informer tous les joueurs de la mise à jour
            io.to(roomCode).emit('playerUpdate', players);
            
            // Si une partie est en cours, informer le nouveau joueur
            const gameState = gameStates.get(roomCode);
            if (gameState?.questions) {
                socket.emit('gameState', 'playing');
                socket.emit('gameStarted', {
                    questions: gameState.questions[gameState.currentIndex],
                    total: gameState.questions.length
                });
            }
            
            // Si c'est l'hôte, envoyer les thèmes
            if (isHost) {
                try {
                    const themes = await themeController.getAllThemes();
                    socket.emit('themes', themes);
                } catch (error) {
                    socket.emit('error', 'Erreur lors de la récupération des thèmes');
                }
            }

            socket.emit('joinConfirmed', { roomCode, players });
        });

        socket.on('startGame', async ({ themeId, roomCode }) => {
            try {
                const questions = await questionController.getQuestionsByThemeId(themeId);
                if (!questions || questions.length === 0) {
                    socket.emit('error', 'Aucune question trouvée pour ce thème');
                    return;
                }

                // Initialiser l'état du jeu
                const gameState = {
                    questions,
                    currentIndex: 0,
                    scores: {},
                    playerAnswers: {},
                    isMovingToNext: false,
                    intervalId: null,
                    questionTimer: null
                };
                gameStates.set(roomCode, gameState);

                // Informer tous les joueurs du démarrage de la partie
                io.to(roomCode).emit('gameState', 'playing');
                io.to(roomCode).emit('gameStarted', {
                    questions: questions[0],
                    total: questions.length
                });

                // Démarrer le timer pour la première question après un court délai
                setTimeout(() => {
                    startQuestionTimer(roomCode, 20);
                }, 500);
            } catch (error) {
                socket.emit('error', 'Erreur lors du démarrage de la partie');
            }
        });

        socket.on('submitAnswer', async ({ questionId, answer, roomCode }) => {
            try {
                const gameState = gameStates.get(roomCode);
                if (!gameState) return;
                
                const players = rooms.get(roomCode) || [];
                
                // Vérifier si le joueur a déjà répondu
                if (gameState.playerAnswers[socket.id]) {
                    return;
                }
                
                const isCorrect = await questionController.checkAnswer(questionId, answer);
                
                // Enregistrer la réponse du joueur
                gameState.playerAnswers[socket.id] = { answer, isCorrect };
                
                // Calculer le score en fonction du temps de réponse
                if (isCorrect) {
                    // Obtenir le temps restant
                    const now = Date.now();
                    const startTime = gameState.questionStartTime || now;
                    const totalTime = 20; // Temps total en secondes
                    const elapsedSeconds = Math.floor((now - startTime) / 1000);
                    const timeLeft = Math.max(0, totalTime - elapsedSeconds);
                    
                    let points = 0;
                    if (timeLeft > 15) {
                        // Réponse dans les 5 premières secondes
                        points = 10;
                    } else if (timeLeft > 10) {
                        // Réponse entre 5 et 10 secondes
                        points = 5;
                    } else {
                        // Réponse après 10 secondes mais avant la fin
                        points = 2;
                    }
                    
                    // Mettre à jour le score
                    gameState.scores[socket.id] = (gameState.scores[socket.id] || 0) + points;
                    
                    console.log(`Joueur ${socket.id} a gagné ${points} points. Temps restant: ${timeLeft}s`);
                }
                
                // Envoyer le résultat au joueur
                socket.emit('answerResult', { correct: isCorrect, questionId, answer });
                
                // Informer tous les joueurs qu'un joueur a répondu
                io.to(roomCode).emit('playerAnswered', { 
                    playerId: socket.id, 
                    answered: true 
                });
                
                // Envoyer les scores mis à jour à tous les joueurs
                const currentScores = {};
                players.forEach(player => {
                    currentScores[player.name] = gameState.scores[player.id] || 0;
                });
                io.to(roomCode).emit('scoresUpdate', currentScores);
                
                // Vérifier si tous les joueurs ont répondu
                const allPlayersAnswered = players.every(player => 
                    gameState.playerAnswers[player.id] !== undefined
                );
                
                if (allPlayersAnswered) {
                    clearTimeout(gameState.questionTimer);
                    moveToNextQuestion(roomCode);
                }
            } catch (error) {
                socket.emit('error', 'Erreur lors de la vérification de la réponse');
            }
        });

        socket.on('disconnect', () => {
            for (const [roomCode, players] of rooms.entries()) {
                const updatedPlayers = players.filter(p => p.id !== socket.id);
                if (updatedPlayers.length !== players.length) {
                    if (updatedPlayers.length > 0) {
                        rooms.set(roomCode, updatedPlayers);
                        io.to(roomCode).emit('playerUpdate', updatedPlayers);
                        
                        const gameState = gameStates.get(roomCode);
                        if (gameState) {
                            const allPlayersAnswered = updatedPlayers.every(player => 
                                gameState.playerAnswers[player.id] !== undefined
                            );
                            
                            if (allPlayersAnswered) {
                                clearTimeout(gameState.questionTimer);
                                moveToNextQuestion(roomCode);
                            }
                        }
                    } else {
                        rooms.delete(roomCode);
                        gameStates.delete(roomCode);
                    }
                }
            }
        });
    });
    
    function startQuestionTimer(roomCode, seconds) {
        const gameState = gameStates.get(roomCode);
        if (!gameState) return;
        
        console.log(`⏱️ Démarrage du timer pour la salle ${roomCode}, temps: ${seconds}s`);
        
        // Nettoyer tout timer existant pour éviter les chevauchements
        if (gameState.intervalId) {
            clearInterval(gameState.intervalId);
            gameState.intervalId = null;
        }
        if (gameState.questionTimer) {
            clearTimeout(gameState.questionTimer);
            gameState.questionTimer = null;
        }
        
        // Enregistrer le temps de départ pour le calcul du score
        gameState.questionStartTime = Date.now();
        
        // Envoyer le temps initial à tous les clients
        io.to(roomCode).emit('timeUpdate', seconds);
        
        // Définir le temps de départ et l'heure de fin
        const startTime = Date.now();
        const endTime = startTime + (seconds * 1000);
        
        // Créer un intervalle qui calcule le temps restant basé sur l'heure actuelle
        const intervalId = setInterval(() => {
            const now = Date.now();
            const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
            
            // Envoyer la mise à jour du temps à tous les clients
            io.to(roomCode).emit('timeUpdate', remaining);
            
            // Si le temps est écoulé, arrêter l'intervalle et passer à la question suivante
            if (remaining <= 0) {
                clearInterval(intervalId);
                moveToNextQuestion(roomCode);
            }
        }, 1000);
        
        // Stocker l'ID de l'intervalle pour pouvoir le nettoyer plus tard
        gameState.intervalId = intervalId;
        
        // Créer un timer de secours qui s'assurera que moveToNextQuestion est appelé
        // même si quelque chose ne va pas avec l'intervalle
        gameState.questionTimer = setTimeout(() => {
            clearInterval(intervalId);
            moveToNextQuestion(roomCode);
        }, seconds * 1000 + 500);
    }
    
    function moveToNextQuestion(roomCode) {
        const gameState = gameStates.get(roomCode);
        if (!gameState) return;
        
        // Éviter les appels multiples à moveToNextQuestion
        if (gameState.isMovingToNext) return;
        gameState.isMovingToNext = true;
        
        // Nettoyer tous les timers existants
        if (gameState.intervalId) {
            clearInterval(gameState.intervalId);
            gameState.intervalId = null;
        }
        if (gameState.questionTimer) {
            clearTimeout(gameState.questionTimer);
            gameState.questionTimer = null;
        }
        
        setTimeout(() => {
            gameState.currentIndex++;
            gameState.playerAnswers = {};
            gameState.isMovingToNext = false;
            
            if (gameState.currentIndex < gameState.questions.length) {
                // Informer tous les clients de passer à la question suivante
                io.to(roomCode).emit('nextQuestion', {
                    question: gameState.questions[gameState.currentIndex],
                    index: gameState.currentIndex
                });
                
                // Délai plus long avant de démarrer le timer pour s'assurer que tous les clients sont prêts
                setTimeout(() => {
                    // Réinitialiser explicitement le temps côté client
                    io.to(roomCode).emit('timeUpdate', 20);
                    // Puis démarrer le timer
                    startQuestionTimer(roomCode, 20);
                }, 1000);
            } else {
                // Convertir les scores pour les envoyer au client
                const finalScores = {};
                const players = rooms.get(roomCode) || [];
                
                players.forEach(player => {
                    finalScores[player.name] = gameState.scores[player.id] || 0;
                });
                
                io.to(roomCode).emit('gameOver', finalScores);
                gameStates.delete(roomCode);
            }
        }, 2000);
    }
};
