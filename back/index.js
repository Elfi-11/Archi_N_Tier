const express = require('express');
const Questions = require('./models/questions');
const app = express();
const PORT = process.env.PORT || 3001;

// Configuration de Socket.IO
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000", // URL de votre frontend React
        methods: ["GET", "POST"]
    }
});

app.use(express.json());

// Configuration des événements Socket.IO
io.on('connection', (socket) => {
    console.log('Un client s\'est connecté:', socket.id);

    // Exemple : Envoyer toutes les questions au client qui se connecte
    socket.on('requestQuestions', async () => {
        try {
            const questions = await Questions.getAllQuestions();
            socket.emit('questions', questions);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    });

    // Exemple : Gérer la réponse d'un joueur
    socket.on('submitAnswer', (data) => {
        console.log(`Joueur ${socket.id} a répondu:`, data);
        // Vous pouvez vérifier la réponse ici et renvoyer le résultat
        socket.emit('answerResult', {
            correct: true,
            message: 'Bonne réponse!'
        });
    });

    socket.on('disconnect', () => {
        console.log('Client déconnecté:', socket.id);
    });
});

// Ajout d'une route racine
app.get('/', (req, res) => {
res.json({ message: 'API Quiz is running!' });
});

// Route pour obtenir toutes les questions
app.get('/api/questions', async (req, res) => {
try {
    const questions = await Questions.getAllQuestions();
    res.json(questions);
} catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: error.message });
}
});

// Route pour obtenir une question spécifique
app.get('/api/questions/:id', async (req, res) => {
try {
    const question = await Questions.getQuestionById(req.params.id);
    if (question) {
    res.json(question);
    } else {
    res.status(404).json({ message: 'Question non trouvée' });
    }
} catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ error: error.message });
}
});

// Remplacez app.listen par server.listen
server.listen(PORT, () => {
console.log(`Serveur démarré sur le port ${PORT}`);
console.log(`Test l'API à http://localhost:${PORT}`);
console.log(`Socket.IO est actif`);
});
