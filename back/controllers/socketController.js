const questionController = require('./questionController');
const themeController = require('./themeController');
const Questions = require('../models/questions');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Un client est connecté');

        socket.on('requestThemes', async () => {
            try {
                const themes = await themeController.getAllThemes();
                socket.emit('themes', themes);
            } catch (error) {
                console.error('Erreur lors de la récupération des thèmes:', error);
                socket.emit('error', 'Erreur lors de la récupération des thèmes');
            }
        });

        socket.on('startGame', async ({ themeId }) => {
            try {
                console.log('Démarrage du jeu avec le thème:', themeId);
                const questions = await questionController.getQuestionsByTheme(themeId);
                
                if (!questions || questions.length === 0) {
                    socket.emit('error', 'Aucune question trouvée pour ce thème');
                    return;
                }

                socket.emit('gameStarted', {
                    questions: questions[0],
                    total: questions.length
                });
                
                io.to(socket.roomId).emit('gameState', 'playing');
            } catch (error) {
                console.error('Erreur lors du démarrage du jeu:', error);
                socket.emit('error', 'Erreur lors du démarrage du jeu');
            }
        });

        socket.on('requestQuestions', async ({ themeId }) => {
            try {
                const questions = await questionController.getQuestionsByThemeId(themeId);
                socket.emit('questions', questions);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        });

        socket.on('submitAnswer', async ({ questionId, answer }) => {
            try {
                const isCorrect = await questionController.checkAnswer(questionId, answer);
                socket.emit('answerResult', {
                    correct: isCorrect,
                    questionId: questionId,
                    answer: answer
                });
            } catch (error) {
                console.error('Error checking answer:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('Un client s\'est déconnecté');
        });
    });
};
