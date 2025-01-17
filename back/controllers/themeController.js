const Themes = require('../models/themes');

const themeController = {
    getAllThemes: async () => {
        try {
            const themes = await Themes.getAllThemes();
            return themes;
        } catch (error) {
            console.error('Error fetching themes:', error);
            throw error;
        }
    },

    getThemeById: async (themeId) => {
        try {
            const theme = await Themes.getThemeById(themeId);
            return theme;
        } catch (error) {
            console.error('Error fetching theme by id:', error);
            throw error;
        }
    }
};

module.exports = themeController;
