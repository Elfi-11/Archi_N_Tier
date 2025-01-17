const questionController = require('./questionController');
const themeController = require('./themeController');

const socketController = (io) => {
    io.on('connection', (socket) => {
        console.log('Un client s\'est connecté:', socket.id);

        socket.on('requestThemes', async () => {
            try {
                const themes = await themeController.getAllThemes();
                socket.emit('themes', themes);
                console.log('Thèmes envoyés au client');
            } catch (error) {
                console.error('Error fetching themes:', error);
            }
        });

        socket.on('requestQuestions', async ({ themeId }) => {
            try {
                const questions = await themeController.getQuestionsByTheme(themeId);
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
                    questionId: questionId
                });
            } catch (error) {
                console.error('Error checking answer:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client déconnecté:', socket.id);
        });
    });
};

module.exports = socketController;
