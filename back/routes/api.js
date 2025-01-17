const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const themeController = require('../controllers/themeController');

// Route racine
router.get('/', (req, res) => {
    res.json({ message: 'API Quiz is running!' });
});

// Route pour obtenir toutes les questions
router.get('/questions', async (req, res) => {
    try {
        const questions = await questionController.getAllQuestions();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route pour obtenir une question spécifique
router.get('/questions/:id', async (req, res) => {
    try {
        const question = await questionController.getQuestionById(req.params.id);
        if (question) {
            res.json(question);
        } else {
            res.status(404).json({ message: 'Question non trouvée' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route pour obtenir tous les thèmes
router.get('/themes', async (req, res) => {
    try {
        const themes = await themeController.getAllThemes();
        res.json(themes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route pour obtenir un thème spécifique
router.get('/themes/:id', async (req, res) => {
    try {
        const theme = await themeController.getThemeById(req.params.id);
        if (theme) {
            res.json(theme);
        } else {
            res.status(404).json({ message: 'Thème non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route pour obtenir toutes les questions d'un thème
router.get('/themes/:id/questions', async (req, res) => {
    try {
        const questions = await questionController.getQuestionsByThemeId(req.params.id);
        if (questions && questions.length > 0) {
            res.json(questions);
        } else {
            res.status(404).json({ message: 'Aucune question trouvée pour ce thème' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
