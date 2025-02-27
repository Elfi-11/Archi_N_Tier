import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { Button, Card, CardBody, Badge, Input } from "@nextui-org/react";
import '../style/quiz.css';

const socket = io('http://localhost:3001', {
    withCredentials: true,
    transports: ['websocket', 'polling']
});

function Quiz() {
    // États
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);
    const [gameState, setGameState] = useState('login');
    const [userName, setUserName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [isHost, setIsHost] = useState(false);
    const [themes, setThemes] = useState([]);
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [scores, setScores] = useState({});
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answerResult, setAnswerResult] = useState(null);
    const [timeLeft, setTimeLeft] = useState(10);
    const [currentPlayers, setCurrentPlayers] = useState([]);

    // Handlers
    const handleAnswer = useCallback((answer) => {
        if (selectedAnswer !== null || !currentQuestion) return;
        setSelectedAnswer(answer);
        socket.emit('submitAnswer', { 
            questionId: currentQuestion.id, 
            answer,
            roomCode 
        });
    }, [currentQuestion, selectedAnswer, roomCode]);

    const handleThemeSelect = useCallback((themeId) => {
        setSelectedTheme(themeId);
        socket.emit('requestQuestions', { themeId });
    }, []);

    const handleStartGame = useCallback(() => {
        if (!selectedTheme) {
            setError('Veuillez sélectionner un thème');
            return;
        }
        socket.emit('startGame', { themeId: selectedTheme, roomCode });
    }, [selectedTheme, roomCode]);

    const handleJoinRoom = useCallback(() => {
        const cleanRoomCode = roomCode.trim();
        if (!cleanRoomCode) {
            setError('Code de salle invalide');
            return;
        }
        socket.emit('joinRoom', { userName, roomCode: cleanRoomCode, isHost: false });
        setGameState('waiting');
    }, [userName, roomCode]);

    const handleCreateRoom = useCallback(() => {
        const newCode = Math.random().toString(36).substring(7).toUpperCase();
        setRoomCode(newCode);
        setIsHost(true);
        socket.emit('joinRoom', { userName, roomCode: newCode, isHost: true });
        setGameState('waiting');
    }, [userName]);

    // Effets
    useEffect(() => {
        socket.on('connect', () => setConnected(true));
        socket.on('disconnect', () => setConnected(false));
        
        socket.on('themes', (receivedThemes) => {
            if (Array.isArray(receivedThemes) && receivedThemes.length > 0) {
                setThemes(receivedThemes);
            }
        });

        socket.on('playerUpdate', (players) => {
            if (Array.isArray(players)) {
                setCurrentPlayers(players);
            }
        });

        socket.on('joinConfirmed', (data) => {
            if (data.players) {
                setCurrentPlayers(data.players);
            }
        });

        socket.on('gameState', (state) => {
            console.log('🎮 État du jeu mis à jour:', state);
            setGameState(state);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('themes');
            socket.off('playerUpdate');
            socket.off('joinConfirmed');
            socket.off('gameState');
        };
    }, []);

    useEffect(() => {
        socket.on('gameStarted', ({ questions, total }) => {
            setGameState('playing');
            setCurrentQuestion(questions);
            setTotalQuestions(total);
            setQuestionIndex(0);
            setSelectedAnswer(null);
            setAnswerResult(null);
            setTimeLeft(10);
        });

        socket.on('error', (message) => {
            console.error('❌', message);
            setError(message);
        });

        socket.on('nextQuestion', ({ question, index }) => {
            setCurrentQuestion(question);
            setQuestionIndex(index);
            setSelectedAnswer(null);
            setAnswerResult(null);
            setTimeLeft(10);
        });

        socket.on('gameOver', (finalScores) => {
            setGameState('gameOver');
            setScores(finalScores);
        });

        return () => {
            socket.off('gameStarted');
            socket.off('error');
            socket.off('nextQuestion');
            socket.off('gameOver');
        };
    }, []);

    useEffect(() => {
        socket.on('answerResult', (result) => {
            setAnswerResult(result);
            if (result.correct) {
                setScores(prev => ({
                    ...prev,
                    [userName]: (prev[userName] || 0) + 1
                }));
            }
        });

        return () => socket.off('answerResult');
    }, [userName]);

    useEffect(() => {
        let timer;
        if (gameState === 'playing' && timeLeft > 0 && !selectedAnswer) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handleAnswer(0); // 0 pour indiquer pas de réponse
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [gameState, timeLeft, selectedAnswer, handleAnswer]);

    // Composants de rendu
    const renderLogin = () => (
        <Card className="my-4">
            <CardBody>
                <h2>Connexion</h2>
                <Input 
                    value={userName} 
                    onChange={(e) => setUserName(e.target.value)} 
                    placeholder="Nom d'utilisateur" 
                />
                <Button 
                    className="mt-4" 
                    onPress={() => setGameState('setup')} 
                    disabled={!userName.trim()}
                >
                    Continuer
                </Button>
            </CardBody>
        </Card>
    );

    const renderSetup = () => (
        <Card className="my-4">
            <CardBody>
                <h2>Configuration de la partie</h2>
                <div className="flex gap-4 my-4">
                    <Button color="primary" onPress={handleCreateRoom}>
                        Créer une partie
                    </Button>
                    <div className="flex-1">
                        <Input 
                            label="Code de la partie" 
                            value={roomCode} 
                            onChange={(e) => setRoomCode(e.target.value.trim())} 
                            placeholder="Entrez le code" 
                        />
                    </div>
                    <Button 
                        color="secondary" 
                        onPress={handleJoinRoom} 
                        disabled={!roomCode.trim()}
                    >
                        Rejoindre
                    </Button>
                </div>
            </CardBody>
        </Card>
    );

    const renderWaitingRoom = () => (
        <Card className="my-4">
            <CardBody>
                <h2 className="text-2xl mb-4">Salle d'attente</h2>
                <div className="bg-gray-100 p-4 rounded my-4">
                    <p>Code de la partie : {roomCode}</p>
                    <p>Votre nom : {userName}</p>
                    <p>Statut : {isHost ? 'Hôte' : 'Joueur'}</p>
                </div>
                <div className="mt-4">
                    <h3 className="text-xl mb-2">Joueurs connectés ({currentPlayers.length}):</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {currentPlayers.map((player) => (
                            <Badge 
                                key={player.id} 
                                color={player.isHost ? "primary" : "default"} 
                                className="p-2"
                            >
                                {player.name} {player.isHost ? "(Hôte)" : ""}
                            </Badge>
                        ))}
                    </div>
                </div>
                {isHost && themes && themes.length > 0 ? (
                    <div className="mt-4">
                        <h3 className="text-xl mb-2">Sélectionner un thème :</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {themes.map((theme) => (
                                <Button
                                    key={theme.id}
                                    color={selectedTheme === theme.id ? "primary" : "default"}
                                    onPress={() => handleThemeSelect(theme.id)}
                                    className="p-4"
                                >
                                    {theme.nom_theme}
                                </Button>
                            ))}
                        </div>
                        <Button
                            color="success"
                            className="mt-4 w-full"
                            onPress={handleStartGame}
                            disabled={!selectedTheme}
                        >
                            Démarrer la partie
                        </Button>
                    </div>
                ) : isHost ? (
                    <div>Chargement des thèmes...</div>
                ) : null}
            </CardBody>
        </Card>
    );

    const renderGame = () => (
        <Card className="my-4">
            <CardBody>
                <div className="flex justify-between items-center mb-4">
                    <Badge content={`Question ${questionIndex + 1}/${totalQuestions}`} />
                    <Badge 
                        content={`Temps: ${timeLeft}s`} 
                        color={timeLeft < 5 ? "danger" : "primary"} 
                    />
                    <Badge content={`Score: ${scores[userName] || 0}`} />
                </div>
                {currentQuestion && (
                    <>
                        <h3 className="text-xl mb-4">{currentQuestion.question}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((num) => (
                                <Button
                                    key={num}
                                    color={answerResult?.answer === num 
                                        ? (answerResult.correct ? "success" : "danger") 
                                        : "default"
                                    }
                                    onPress={() => handleAnswer(num)}
                                    disabled={selectedAnswer !== null}
                                >
                                    {currentQuestion[`reponse${num}`]}
                                </Button>
                            ))}
                        </div>
                    </>
                )}
            </CardBody>
        </Card>
    );

    // Rendu principal
    return (
        <div className="max-w-4xl mx-auto p-4">
            <Badge color={connected ? "success" : "danger"}>
                {connected ? 'Connecté' : 'Déconnecté'}
            </Badge>

            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            {gameState === 'login' && renderLogin()}
            {gameState === 'setup' && renderSetup()}
            {gameState === 'waiting' && renderWaitingRoom()}
            {gameState === 'playing' && renderGame()}
        </div>
    );
}

export default Quiz;
