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

        socket.on('questions', (data) => {
            console.log('Questions reçues:', data);
            setQuestions(data);
        });

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
        });

        return () => {
            socket.off('connect');
            socket.off('themes');
            socket.off('questions');
            socket.off('answerResult');
        };
    }, []);

    const handleThemeSelect = (themeId) => {
        console.log('Thème sélectionné:', themeId);
        setSelectedTheme(themeId);
        socket.emit('requestQuestions', { themeId });
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
            {selectedTheme && questions.map(question => (
                <Card key={question.id} className="my-4">
                    <CardBody>
                        <h3 className="text-xl font-bold mb-4">{question.question}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((num) => (
                                <Button
                                    key={num}
                                    onPress={() => handleAnswer(question.id, num)}
                                    isDisabled={answerColors[question.id] !== undefined}
                                    color={answerColors[question.id]?.answeredButton === num 
                                        ? answerColors[question.id]?.color 
                                        : "default"
                                    }
                                    className="w-full"
                                >
                                    {question[`reponse${num}`]}
                                </Button>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}

export default Quiz; 