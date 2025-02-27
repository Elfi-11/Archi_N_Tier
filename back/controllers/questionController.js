const Questions = require('../models/questions');

const questionController = {
    getAllQuestions: async () => {
        try {
            return await Questions.getAllQuestions();
        } catch (error) {
            console.error('❌ Erreur getAllQuestions:', error);
            throw error;
        }
    },

    getQuestionById: async (id) => {
        try {
            const question = await Questions.getQuestionById(id);
            return question;
        } catch (error) {
            console.error('Error fetching question:', error);
            throw error;
        }
    },

    getQuestionsByThemeId: async (themeId) => {
        try {
            return await Questions.getQuestionsByThemeId(themeId);
        } catch (error) {
            console.error('❌ Erreur getQuestionsByThemeId:', error);
            throw error;
        }
    },

    checkAnswer: async (questionId, answer) => {
        try {
            return await Questions.checkAnswer(questionId, answer);
        } catch (error) {
            console.error('❌ Erreur checkAnswer:', error);
            throw error;
        }
    }
};

module.exports = questionController;
