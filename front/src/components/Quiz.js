import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Button, Card, CardBody, Badge } from "@nextui-org/react";

const socket = io('http://localhost:3001');

function Quiz() {
    const [questions, setQuestions] = useState([]);
    const [connected, setConnected] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [themes, setThemes] = useState([]);
    const [answerColors, setAnswerColors] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [countdown, setCountdown] = useState(null);
    const [countchrono, setCountchrono] = useState(null);   
    

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connecté au serveur');
            setConnected(true);
            socket.emit('requestThemes');
            console.log('Thèmes demandés');
        });

        socket.on('themes', (data) => {
            console.log('Thèmes reçus:', data);
            setThemes(data);
        });

        return () => {
            socket.off('connect');
            socket.off('themes');
        };            

    }, []);

    useEffect(() => {
        socket.on('questions', (data) => {
            console.log('Questions reçues:', data);
            console.log('Nombre de questions reçues:', data.length);
            setQuestions(data);
            setCurrentQuestionIndex(0);
            setCountchrono(10);
        });

        return () => {
            socket.off('questions');
        };
    }, [questions]);

    useEffect(() => {
        socket.on('answerResult', (result) => {
            console.log('Résultat reçu:', result);
            console.log('Question ID:', result.questionId);
            console.log('Réponse donnée:', result.answer);
            console.log('Est correct:', result.correct);
            
            setAnswerColors(prev => {
                const newColors = {
                    ...prev,
                    [result.questionId]: {
                        color: result.correct ? 'success' : 'danger',
                        answeredButton: result.answer
                    }
                };
                console.log('Nouveau state answerColors:', newColors);
                return newColors;
            });

            console.log('Index actuel:', currentQuestionIndex);
            console.log('Nombre total de questions:', questions.length);

            if (currentQuestionIndex <= questions.length - 1) {
                setCountdown(1);
            } else {
                alert('Quiz terminé !');
            }
        });

        return () => {
            socket.off('answerResult');
        };
    }, [questions, currentQuestionIndex]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (countdown === 0) {
            if (!questions.length) {
                socket.emit('requestQuestions', { themeId: selectedTheme });
            } else {
                setCurrentQuestionIndex(prev => prev + 1);
                setCountchrono(10);
            }
        }
    }, [countdown, selectedTheme, questions]);

    useEffect(() => {
        if (countchrono > 0) {
            const timer = setInterval(() => {
                setCountchrono(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (countchrono === 0) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    }, [countchrono]);

    const handleThemeSelect = (themeId) => {
        console.log('Thème sélectionné:', themeId);
        setSelectedTheme(themeId);
        setCountdown(3);
    };

    const handleAnswer = (questionId, answer) => {
        console.log('Réponse soumise:', { questionId, answer });
        socket.emit('submitAnswer', {
            questionId,
            answer
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-4xl font-bold mb-4">Quiz en temps réel</h1>
            <Badge color={connected ? "success" : "danger"}>
                {connected ? 'Connecté' : 'Déconnecté'}
            </Badge>

            {/* Debug info */}
            <Card className="my-4">
                <CardBody>
                    <p>Nombre de thèmes: {themes.length}</p>
                    <p>Thème sélectionné: {selectedTheme}</p>
                    <p>Nombre de questions: {questions.length}</p>
                </CardBody>
            </Card>

            {/* Sélection du thème */}
            {themes.length > 0 && !selectedTheme && (
                <Card className="my-4">
                    <CardBody>
                        <h2 className="text-2xl font-bold mb-4">Choisissez un thème</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {themes.map(theme => (
                                <Button 
                                    key={theme.id}
                                    onPress={() => handleThemeSelect(theme.id)}
                                    color="primary"
                                >
                                    {theme.nom_theme}
                                </Button>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Questions */}
            {selectedTheme && questions[currentQuestionIndex] && (
                <>
                    <Card key={questions[currentQuestionIndex].id} className="my-4">
                        <CardBody>
                            <h3 className="text-xl font-bold mb-4">{questions[currentQuestionIndex].question}</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((num) => (
                                    <Button
                                        key={num}
                                        onPress={() => handleAnswer(questions[currentQuestionIndex].id, num)}
                                        isDisabled={answerColors[questions[currentQuestionIndex].id] !== undefined}
                                        color={answerColors[questions[currentQuestionIndex].id]?.answeredButton === num 
                                            ? answerColors[questions[currentQuestionIndex].id]?.color 
                                            : "default"
                                        }
                                        className="w-full"
                                    >
                                        {questions[currentQuestionIndex][`reponse${num}`]}
                                    </Button>
                                ))}
                            </div>
                        </CardBody>
                    </Card>

                    {countchrono > 0 && questions.length > 0 && (
                        <div className="flex justify-center items-center mt-[50px]">
                            <Badge 
                                content={countchrono} 
                                size="lg"
                                color="primary"
                                className="text-4xl p-6"
                                variant="shadow"
                            >
                            </Badge>
                        </div>
                    )}
                </>
            )}

            {/* Décompte initial (3,2,1) */}
            {countdown > 0 && !questions.length && (
                <div className="flex justify-center items-center min-h-[200px]">
                    <Badge 
                        content={countdown} 
                        size="lg"
                        color="primary"
                        className="text-6xl p-8"
                        variant="shadow"
                    >
                    </Badge>
                </div>
            )}
        </div>
    );
}

export default Quiz; 