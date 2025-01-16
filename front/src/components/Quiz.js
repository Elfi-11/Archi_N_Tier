import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

function Quiz() {
    const [questions, setQuestions] = useState([]);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // Connexion établie
        socket.on('connect', () => {
            console.log('Connecté au serveur');
            setConnected(true);
            // Demander les questions
            socket.emit('requestQuestions');
        });

        // Réception des questions
        socket.on('questions', (data) => {
            setQuestions(data);
        });

        // Réception du résultat d'une réponse
        socket.on('answerResult', (result) => {
            if (result.correct) {
                console.log('Bonne réponse!');
            } else {
                console.log('Mauvaise réponse!');
            }
        });

        return () => {
            socket.off('connect');
            socket.off('questions');
            socket.off('answerResult');
        };
    }, []);

    // Exemple de soumission de réponse
    const handleAnswer = (questionId, answer) => {
        socket.emit('submitAnswer', {
            questionId,
            answer
        });
    };

    return (
        <div>
            <h1>Quiz en temps réel</h1>
            {connected ? 'Connecté' : 'Déconnecté'}
            {questions.map(question => (
                <div key={question.id}>
                    <h3>{question.question}</h3>
                    <button onClick={() => handleAnswer(question.id, 1)}>{question.reponse1}</button>
                    <button onClick={() => handleAnswer(question.id, 2)}>{question.reponse2}</button>
                    <button onClick={() => handleAnswer(question.id, 3)}>{question.reponse3}</button>
                    <button onClick={() => handleAnswer(question.id, 4)}>{question.reponse4}</button>
                </div>
            ))}
        </div>
    );
}

export default Quiz; 