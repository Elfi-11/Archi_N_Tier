const Questions = require('../models/questions');

const questionController = {
    getAllQuestions: async (req, res) => {
        try {
            const questions = await Questions.getAllQuestions();
            return questions;
        } catch (error) {
            console.error('Error fetching questions:', error);
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

    getQuestionsByThemeId: async (themeid) => {
        try {
            const questions = await Questions.getQuestionsByThemeId(themeid);
            return questions;
        } catch (error) {
            console.error('Error fetching questions by theme:', error);
            throw error;
        }
    },

    checkAnswer: async (questionId, answer) => {
        try {
            const question = await Questions.getQuestionById(questionId);
            return question.bonne_reponse === answer;
        } catch (error) {
            console.error('Error checking answer:', error);
            throw error;
        }
    }
};

module.exports = questionController;
