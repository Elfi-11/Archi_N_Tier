/**
 * Composant principal du jeu de quiz
 * Gère toute la logique du jeu côté client, la communication avec le serveur via Socket.IO,
 * et les différentes étapes du jeu (connexion, configuration, salle d'attente, jeu, résultats)
 */
import { useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { Button, Card, CardBody, Input, Progress, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import Confetti from 'react-confetti'; // Bibliothèque pour l'animation de confettis
import '../style/quiz.css';

// Initialisation de la connexion Socket.IO
const socket = io('http://localhost:3001', {
    withCredentials: true,
    transports: ['websocket', 'polling']
});

function Quiz() {
    // États de base pour la gestion du jeu
    const [connected, setConnected] = useState(false); // État de connexion au serveur
    const [error, setError] = useState(null); // Messages d'erreur
    const [gameState, setGameState] = useState('login'); // État actuel du jeu (login, setup, waiting, playing, gameOver)
    const [userName, setUserName] = useState(''); // Nom du joueur
    const [roomCode, setRoomCode] = useState(''); // Code de la salle
    const [isHost, setIsHost] = useState(false); // Si le joueur est l'hôte de la partie
    const [themes, setThemes] = useState([]); // Liste des thèmes disponibles
    const [selectedTheme, setSelectedTheme] = useState(null); // Thème sélectionné pour la partie
    
    // États pour la gestion des questions
    const [currentQuestion, setCurrentQuestion] = useState(null); // Question actuelle
    const [questionIndex, setQuestionIndex] = useState(0); // Index de la question actuelle
    const [totalQuestions, setTotalQuestions] = useState(0); // Nombre total de questions
    const [scores, setScores] = useState({}); // Scores des joueurs
    const [selectedAnswer, setSelectedAnswer] = useState(null); // Réponse sélectionnée par le joueur
    const [answerResult, setAnswerResult] = useState(null); // Résultat de la réponse (correct/incorrect)
    const [timeLeft, setTimeLeft] = useState(20); // Temps restant pour répondre
    
    // États pour la gestion des joueurs
    const [currentPlayers, setCurrentPlayers] = useState([]); // Liste des joueurs connectés
    const [waitingForOthers, setWaitingForOthers] = useState(false); // Si on attend les autres joueurs
    const [playerAnswers, setPlayerAnswers] = useState({}); // Suivi des réponses des joueurs
    
    // Nouveaux états pour la modal et les confettis
    const [winnerModalOpen, setWinnerModalOpen] = useState(false); // État d'ouverture de la modal du gagnant
    const [winner, setWinner] = useState(null); // Informations sur le gagnant
    const [showConfetti, setShowConfetti] = useState(false); // Affichage des confettis
    const confettiRef = useRef(null); // Référence pour le conteneur des confettis

    // Gestionnaire de réponse aux questions
    const handleAnswer = useCallback((answer) => {
        if (selectedAnswer !== null || !currentQuestion) return;
        
        // Empêcher les clics multiples
        setSelectedAnswer(answer);
        setWaitingForOthers(true);
        
        // Envoyer la réponse au serveur
        socket.emit('submitAnswer', { 
            questionId: currentQuestion.id, 
            answer,
            roomCode 
        });
        
        // Mettre à jour localement l'état des réponses des joueurs
        setPlayerAnswers(prev => ({
            ...prev,
            [socket.id]: true
        }));
    }, [currentQuestion, selectedAnswer, roomCode]);

    // Gestionnaire de sélection de thème
    const handleThemeSelect = useCallback((themeId) => {
        setSelectedTheme(themeId);
        socket.emit('requestQuestions', { themeId });
    }, []);

    // Gestionnaire de démarrage de partie
    const handleStartGame = useCallback(() => {
        if (!selectedTheme) {
            setError('Veuillez sélectionner un thème');
            return;
        }
        socket.emit('startGame', { themeId: selectedTheme, roomCode });
    }, [selectedTheme, roomCode]);

    // Gestionnaire pour rejoindre une salle
    const handleJoinRoom = useCallback(() => {
        const cleanRoomCode = roomCode.trim().toUpperCase();
        if (!cleanRoomCode) {
            setError('Code de salle invalide');
            return;
        }
        socket.emit('joinRoom', { userName, roomCode: cleanRoomCode, isHost: false });
        setGameState('waiting');
    }, [userName, roomCode]);

    // Gestionnaire pour créer une salle
    const handleCreateRoom = useCallback(() => {
        const newCode = Math.random().toString(36).substring(7).toUpperCase();
        setRoomCode(newCode);
        setIsHost(true);
        socket.emit('joinRoom', { userName, roomCode: newCode, isHost: true });
        setGameState('waiting');
    }, [userName]);

    // Effet pour la gestion des événements socket de base
    useEffect(() => {
        // Événements de connexion
        socket.on('connect', () => setConnected(true));
        socket.on('disconnect', () => setConnected(false));
        
        // Réception des thèmes
        socket.on('themes', (receivedThemes) => {
            if (Array.isArray(receivedThemes) && receivedThemes.length > 0) {
                setThemes(receivedThemes);
            }
        });

        // Mise à jour des joueurs
        socket.on('playerUpdate', (players) => {
            if (Array.isArray(players)) {
                setCurrentPlayers(players);
            }
        });

        // Suivi des réponses des joueurs
        socket.on('playerAnswered', ({ playerId, answered }) => {
            setPlayerAnswers(prev => ({
                ...prev,
                [playerId]: answered
            }));
        });

        // Mise à jour des scores
        socket.on('scoresUpdate', (updatedScores) => {
            console.log('📊 Scores mis à jour:', updatedScores);
            setScores(updatedScores);
        });

        // Confirmation de connexion à une salle
        socket.on('joinConfirmed', (data) => {
            if (data.players) {
                setCurrentPlayers(data.players);
            }
        });

        // Mise à jour de l'état du jeu
        socket.on('gameState', (state) => {
            console.log('🎮 État du jeu mis à jour:', state);
            setGameState(state);
        });

        // Mise à jour du temps restant
        socket.on('timeUpdate', (time) => {
            console.log('⏱️ Mise à jour du temps:', time);
            setTimeLeft(time);
        });

        // Nettoyage des écouteurs d'événements
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('themes');
            socket.off('playerUpdate');
            socket.off('playerAnswered');
            socket.off('scoresUpdate');
            socket.off('joinConfirmed');
            socket.off('gameState');
            socket.off('timeUpdate');
        };
    }, []);

    // Effet pour la gestion des événements liés au jeu
    useEffect(() => {
        // Démarrage du jeu
        socket.on('gameStarted', ({ questions, total }) => {
            console.log('🎮 Partie démarrée, total de questions:', total);
            // Réinitialiser tous les états du jeu
            setGameState('playing');
            setCurrentQuestion(questions);
            setTotalQuestions(total);
            setQuestionIndex(0);
            setSelectedAnswer(null);
            setAnswerResult(null);
            setTimeLeft(20); // Réinitialiser explicitement le temps
            setWaitingForOthers(false);
            setPlayerAnswers({});
            setScores({});
        });

        // Gestion des erreurs
        socket.on('error', (message) => {
            console.error('❌', message);
            setError(message);
            setTimeout(() => setError(null), 5000);
        });

        // Passage à la question suivante
        socket.on('nextQuestion', ({ question, index }) => {
            console.log('📝 Nouvelle question reçue:', index + 1);
            // Réinitialiser tous les états liés à la question
            setCurrentQuestion(question);
            setQuestionIndex(index);
            setSelectedAnswer(null);
            setAnswerResult(null);
            setTimeLeft(20); // Réinitialiser explicitement le temps
            setWaitingForOthers(false);
            setPlayerAnswers({});
        });

        // Fin du jeu
        socket.on('gameOver', (finalScores) => {
            setGameState('gameOver');
            setScores(finalScores);
        });

        // Nettoyage des écouteurs d'événements
        return () => {
            socket.off('gameStarted');
            socket.off('error');
            socket.off('nextQuestion');
            socket.off('gameOver');
        };
    }, []);

    // Effet pour la gestion des résultats de réponse
    useEffect(() => {
        socket.on('answerResult', (result) => {
            setAnswerResult(result);
            
            // Marquer ce joueur comme ayant répondu
            setPlayerAnswers(prev => ({
                ...prev,
                [socket.id]: true
            }));
            
            // Mettre à jour le score local si la réponse est correcte
            if (result.correct) {
                // Le score est maintenant géré par le serveur en fonction du temps
                // Nous n'avons plus besoin de l'incrémenter ici
            }
        });

        return () => socket.off('answerResult');
    }, []);

    // Effet pour la gestion du timer local
    useEffect(() => {
        let timer;
        
        // Ne démarrer le timer que si nous sommes en jeu, qu'il reste du temps et qu'aucune réponse n'a été sélectionnée
        if (gameState === 'playing' && timeLeft > 0 && !selectedAnswer) {
            console.log('⏱️ Démarrage du timer local, temps restant:', timeLeft);
            
            // Nettoyer tout timer existant avant d'en créer un nouveau
            if (timer) clearInterval(timer);
            
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    // Si le temps est écoulé, soumettre une réponse par défaut
                    if (prev <= 1) {
                        clearInterval(timer);
                        console.log('⏱️ Temps écoulé, soumission de réponse par défaut');
                        handleAnswer(0); // 0 pour indiquer pas de réponse
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        // Nettoyer le timer lors du démontage ou lorsque les dépendances changent
        return () => {
            if (timer) {
                console.log('⏱️ Nettoyage du timer local');
                clearInterval(timer);
            }
        };
    }, [gameState, timeLeft, selectedAnswer, handleAnswer]);

    // Effet pour déterminer le gagnant et afficher la modal
    useEffect(() => {
        if (gameState === 'gameOver' && Object.keys(scores).length > 0) {
            // Trouver le joueur avec le score le plus élevé
            const sortedPlayers = Object.entries(scores).sort((a, b) => b[1] - a[1]);
            const topPlayer = sortedPlayers[0];
            
            if (topPlayer) {
                // S'assurer que le nom du joueur est correctement utilisé
                setWinner({
                    name: topPlayer[0], // Le nom du joueur est la clé dans l'objet scores
                    score: topPlayer[1]  // Le score est la valeur
                });
                
                // Ouvrir la modal avec un petit délai pour l'effet
                setTimeout(() => {
                    setWinnerModalOpen(true);
                    setShowConfetti(true);
                    
                    // Arrêter les confettis après 10 secondes
                    setTimeout(() => {
                        setShowConfetti(false);
                    }, 10000);
                }, 1000);
            }
        }
    }, [gameState, scores]);

    // Composant de rendu pour l'écran de connexion
    const renderLogin = () => (
        <Card className="quiz-card my-4">
            <CardBody className="p-4 p-sm-6">
                <div className="text-center mb-4 sm:mb-6">
                    <div className="flex justify-center mb-3 sm:mb-4">
                        <div className="relative">
                            <div className="absolute -top-2 -right-2 w-6 sm:w-8 h-6 sm:h-8 bg-primary rounded-full flex items-center justify-center animate-pulse">
                                <span className="text-white text-xs">?</span>
                            </div>
                            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-3xl sm:text-4xl">🧠</span>
                            </div>
                        </div>
                    </div>
                    <h2 className="quiz-title text-xl sm:text-2xl mb-1 sm:mb-2">Bienvenue au Quiz!</h2>
                    <p className="text-gray-500 text-sm sm:text-base">Testez vos connaissances en temps réel</p>
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                    <div className="fade-in-up delay-1">
                        <Input 
                            label="Nom d'utilisateur"
                            value={userName} 
                            onChange={(e) => setUserName(e.target.value)} 
                            placeholder="Entrez votre nom" 
                            className="mb-4"
                            size="lg"
                            variant="bordered"
                            startContent={<span className="text-xl">👤</span>}
                        />
                    </div>
                    
                    <div className="fade-in-up delay-2">
                        <Button 
                            className="quiz-btn w-full" 
                            color="primary"
                            size="lg"
                            onPress={() => setGameState('setup')} 
                            disabled={!userName.trim()}
                            startContent={<span className="text-xl">🚀</span>}
                        >
                            Commencer l'aventure
                        </Button>
                    </div>
                    
                    <div className="fade-in-up delay-3 text-center mt-3 sm:mt-4">
                        <p className="text-xs text-gray-500">
                            En continuant, vous acceptez de jouer équitablement et de vous amuser !
                        </p>
                    </div>
                </div>
            </CardBody>
        </Card>
    );

    // Composant de rendu pour l'écran de configuration
    const renderSetup = () => (
        <Card className="quiz-card my-4">
            <CardBody className="p-4 p-sm-6">
                <h2 className="quiz-title text-xl sm:text-2xl mb-4 sm:mb-6">Configuration de la partie</h2>
                <div className="flex flex-col gap-3 sm:gap-4 my-4 sm:my-6">
                    <Button 
                        className="quiz-btn" 
                        color="primary" 
                        size="lg"
                        startContent={<span className="text-xl">🎮</span>}
                        onPress={handleCreateRoom}
                    >
                        Créer une nouvelle partie
                    </Button>
                    <div className="relative my-3 sm:my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-4 text-sm text-gray-500">OU</span>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Input 
                            label="Code de la partie" 
                            value={roomCode} 
                            onChange={(e) => setRoomCode(e.target.value.trim().toUpperCase())} 
                            placeholder="Entrez le code" 
                            className="flex-1"
                            size="lg"
                            variant="bordered"
                            startContent={<span className="text-xl">🔑</span>}
                        />
                        <Button 
                            className="quiz-btn mt-2 sm:mt-0" 
                            color="secondary" 
                            size="lg"
                            onPress={handleJoinRoom} 
                            disabled={!roomCode.trim()}
                        >
                            Rejoindre
                        </Button>
                    </div>
                </div>
            </CardBody>
        </Card>
    );

    // Composant de rendu pour la salle d'attente
    const renderWaitingRoom = () => (
        <Card className="quiz-card my-4">
            <CardBody className="p-6">
                <h2 className="quiz-title text-2xl mb-6">Salle d'attente</h2>
                <div className="waiting-room">
                    <p className="mb-2">Code de la partie :</p>
                    <div className="room-code">{roomCode}</div>
                    <div className="bg-gray-100 p-4 rounded my-4">
                        <p>Votre nom : <span className="font-bold">{userName}</span></p>
                        <p>Statut : <span className="font-bold">{isHost ? 'Hôte' : 'Joueur'}</span></p>
                    </div>
                </div>
                <div className="mt-6">
                    <h3 className="text-xl mb-4">Joueurs connectés ({currentPlayers.length}):</h3>
                    <div className="player-list">
                        {currentPlayers.map((player, index) => (
                            <span 
                                key={`player-list-${player.id}-${index}`} 
                                className={`quiz-badge ${player.isHost ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'} p-2 m-1 inline-block text-center`}
                            >
                                {player.name} {player.isHost ? "👑" : ""}
                            </span>
                        ))}
                    </div>
                </div>
                {isHost && themes && themes.length > 0 ? (
                    <div className="mt-6">
                        <h3 className="text-xl mb-4">Sélectionner un thème :</h3>
                        <div className="theme-grid">
                            {themes.map((theme) => (
                                <Button
                                    key={theme.id}
                                    color={selectedTheme === theme.id ? "primary" : "default"}
                                    onPress={() => handleThemeSelect(theme.id)}
                                    className={`theme-btn ${selectedTheme === theme.id ? 'selected' : ''}`}
                                    variant={selectedTheme === theme.id ? "shadow" : "flat"}
                                    size="lg"
                                >
                                    {theme.nom_theme}
                                </Button>
                            ))}
                        </div>
                        <Button
                            color="success"
                            className="quiz-btn mt-6 w-full"
                            size="lg"
                            onPress={handleStartGame}
                            disabled={!selectedTheme}
                            startContent={<span className="text-xl">🚀</span>}
                        >
                            Démarrer la partie
                        </Button>
                    </div>
                ) : isHost ? (
                    <div className="waiting-message">Chargement des thèmes...</div>
                ) : (
                    <div className="waiting-message">
                        <p>En attente que l'hôte démarre la partie...</p>
                        <div className="mt-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                        </div>
                    </div>
                )}
            </CardBody>
        </Card>
    );

    // Composant de rendu pour l'écran de jeu
    const renderGame = () => (
        <Card className="quiz-card my-4">
            <CardBody className="p-6">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
                    <span className="quiz-badge bg-primary-100 text-primary-700 min-w-[130px] inline-block text-center py-2 px-4">
                        Question {questionIndex + 1}/{totalQuestions}
                    </span>
                    <span className={`quiz-badge ${timeLeft < 5 ? 'bg-danger-100 text-danger-700' : 'bg-primary-100 text-primary-700'} min-w-[110px] inline-block text-center py-2 px-4`}>
                        Temps: {timeLeft}s
                    </span>
                    <span className="quiz-badge bg-secondary-100 text-secondary-700 min-w-[110px] inline-block text-center py-2 px-4">
                        Score: {scores[userName] || 0}
                    </span>
                </div>
                
                {/* Barre de progression du temps avec animation fluide */}
                <div className="timer-container">
                    <Progress 
                        value={timeLeft * 5} 
                        maxValue={100} 
                        color={timeLeft < 5 ? "danger" : "primary"}
                        className="timer-progress mb-4"
                        aria-label="Temps restant"
                        showValueLabel={false}
                        classNames={{
                            base: "w-full",
                            track: "transition-all duration-200",
                            indicator: "transition-all duration-200",
                        }}
                    />
                </div>
                
                {currentQuestion && (
                    <div className="question-container">
                        <h3 className="question-text">{currentQuestion.question}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((num) => {
                                const isSelected = selectedAnswer === num;
                                const isCorrect = answerResult?.answer === num && answerResult.correct;
                                const isIncorrect = answerResult?.answer === num && !answerResult.correct;
                                
                                return (
                                    <Button
                                        key={num}
                                        className={`answer-btn ${isSelected ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isIncorrect ? 'incorrect' : ''}`}
                                        color={isCorrect ? "success" : isIncorrect ? "danger" : "default"}
                                        onPress={() => handleAnswer(num)}
                                        disabled={selectedAnswer !== null}
                                        aria-label={`Réponse ${num}`}
                                        variant={isSelected ? "shadow" : "flat"}
                                        size="lg"
                                    >
                                        {currentQuestion[`reponse${num}`]}
                                    </Button>
                                );
                            })}
                        </div>
                        
                        {/* Information sur les points */}
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-600">
                                <span className="font-bold">Points par réponse correcte :</span><br />
                                10 pts (0-5s) | 5 pts (5-10s) | 2 pts (après 10s et avant 20s)
                            </p>
                        </div>
                    </div>
                )}
                
                {/* Message d'attente */}
                {waitingForOthers && (
                    <div className="waiting-message">
                        <p className="mb-2">En attente des autres joueurs...</p>
                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                            {currentPlayers.map((player, index) => (
                                <span 
                                    key={`player-status-${player.id}-${index}`}
                                    className={`quiz-badge ${playerAnswers[player.id] ? 'bg-success-100 text-success-700' : 'bg-gray-100 text-gray-700'} m-1 inline-block text-center py-1 px-3`}
                                >
                                    {playerAnswers[player.id] ? "✓ " : "⏳ "}{player.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </CardBody>
        </Card>
    );

    // Composant de rendu pour l'écran de fin de partie
    const renderGameOver = () => (
        <Card className="quiz-card my-4">
            <CardBody className="p-4 p-sm-6">
                <h2 className="quiz-title text-xl sm:text-2xl mb-4 sm:mb-6">Partie terminée !</h2>
                <div className="results-container">
                    <div className="trophy-icon text-3xl sm:text-4xl">🏆</div>
                    <h3 className="text-lg sm:text-xl mb-3 sm:mb-4">Scores finaux :</h3>
                    <div className="score-list">
                        {Object.entries(scores).sort((a, b) => b[1] - a[1]).map(([playerName, score], index) => (
                            <div 
                                key={`score-${playerName}-${index}`} 
                                className={`score-item ${index === 0 ? 'winner' : ''}`}
                            >
                                <span className="truncate max-w-[150px] sm:max-w-[200px]">{index === 0 ? "👑 " : `${index + 1}. `}{playerName}</span>
                                <span 
                                    className={`quiz-badge ${index === 0 ? 'bg-warning-100 text-warning-700' : 'bg-primary-100 text-primary-700'} inline-block text-center py-1 px-3`}
                                >
                                    {score} points
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-6">
                    <Button 
                        className="quiz-btn flex-1"
                        color="primary" 
                        size="lg"
                        startContent={<span className="text-xl">🔄</span>}
                        onPress={() => setGameState('setup')}
                    >
                        Nouvelle partie
                    </Button>
                    <Button
                        className="quiz-btn flex-1 mt-2 sm:mt-0"
                        color="secondary"
                        size="lg"
                        startContent={<span className="text-xl">🎉</span>}
                        onPress={() => setWinnerModalOpen(true)}
                    >
                        Voir le gagnant
                    </Button>
                </div>
            </CardBody>
        </Card>
    );

    // Rendu principal
    return (
        <div className="quiz-container max-w-4xl mx-auto p-4" ref={confettiRef}>
            {/* Animation de confettis */}
            {showConfetti && (
                <Confetti
                    width={confettiRef.current?.offsetWidth || window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={300}
                    gravity={0.2}
                />
            )}
            
            <div className="flex flex-col items-center mb-6">
                <div className="mb-4">
                    <div className="flex items-center justify-center bg-white p-3 rounded-full shadow-lg">
                        <span className="text-4xl">🎮</span>
                    </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white text-center">Quiz Master</h1>
                <p className="text-white text-center mt-2 opacity-80">Le jeu de quiz en temps réel</p>
                
                <div className="mt-4">
                    <span className={`quiz-badge ${connected ? 'bg-success-100 text-success-700' : 'bg-danger-100 text-danger-700'} min-w-[120px] inline-block text-center py-2 px-4`}>
                        {connected ? '🟢 Connecté' : '🔴 Déconnecté'}
                    </span>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 shadow-md animate-pulse">
                    <div className="flex items-center">
                        <span className="text-xl mr-2">⚠️</span>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {/* Rendu conditionnel en fonction de l'état du jeu avec animations */}
            <div className="fade-in-up">
                {gameState === 'login' && renderLogin()}
                {gameState === 'setup' && renderSetup()}
                {gameState === 'waiting' && renderWaitingRoom()}
                {gameState === 'playing' && renderGame()}
                {gameState === 'gameOver' && renderGameOver()}
            </div>
            
            {/* Footer */}
            <div className="mt-6 text-center text-white opacity-70 text-sm">
                <p>© 2025 Quiz Master - Tous droits réservés</p>
            </div>
            
            {/* Modal du gagnant avec animation */}
            <Modal 
                isOpen={winnerModalOpen} 
                onClose={() => setWinnerModalOpen(false)}
                size="lg"
                backdrop="blur"
                className="winner-modal"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="modal-header flex flex-col gap-1 text-center">
                                <span className="text-3xl">🎉 Félicitations 🎉</span>
                            </ModalHeader>
                            <ModalBody className="text-center p-6">
                                {winner && (
                                    <>
                                        <h2 className="winner-name">{winner.name}</h2>
                                        <p className="text-xl mb-2">a remporté la partie avec</p>
                                        <p className="text-3xl font-bold text-amber-500">{winner.score} points</p>
                                        <div className="flex justify-center my-6">
                                            <div className="trophy-icon">🏆</div>
                                        </div>
                                    </>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button 
                                    className="quiz-btn"
                                    color="primary" 
                                    onPress={onClose}
                                >
                                    Fermer
                                </Button>
                                <Button 
                                    className="quiz-btn"
                                    color="success" 
                                    onPress={() => {
                                        onClose();
                                        setGameState('setup');
                                    }}
                                >
                                    Nouvelle partie
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

export default Quiz;