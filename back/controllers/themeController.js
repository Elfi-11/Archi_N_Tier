const Themes = require('../models/themes');

const themeController = {
    getAllThemes: async () => {
        try {
            return await Themes.getAllThemes();
        } catch (error) {
            console.error('❌ Erreur getAllThemes:', error);
            throw error;
        }
    },

    getThemeById: async (id) => {
        try {
            return await Themes.getThemeById(id);
        } catch (error) {
            console.error('❌ Erreur getThemeById:', error);
            throw error;
        }
    }
};

module.exports = themeController;
