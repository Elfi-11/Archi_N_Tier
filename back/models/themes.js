const db = require('../app');

module.exports = {
// Récupérer toutes les themes
async getAllThemes() {
    try {
        console.log('Tentative de récupération des thèmes...');
        const themes = await db('themes').select('*');
        console.log('Thèmes récupérés de la BD:', themes);
        return themes;
    } catch (error) {
        console.error('Erreur dans getAllThemes:', error);
        throw error;
    }
},

// Récupérer une theme par son ID
async getThemeById(id) {
    console.log('Recherche du thème:', id);
    const theme = await db('themes').where({ id }).first();
    console.log('Thème trouvé:', theme);
    return theme;
},

// Ajouter une nouvelle theme
addTheme(theme) {
    return db('themes').insert(theme);
}
}; 