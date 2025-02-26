const db = require('../app');

module.exports = {
// Récupérer tous les thèmes
async getAllThemes() {
    try {
        return await db('themes').select('*');
    } catch (error) {
        console.error('❌ Erreur BD getAllThemes:', error);
        throw error;
    }
},

// Récupérer une theme par son ID
async getThemeById(id) {
    try {
        return await db('themes').where({ id }).first();
    } catch (error) {
        console.error('❌ Erreur BD getThemeById:', error);
        throw error;
    }
},

// Ajouter une nouvelle theme
addTheme(theme) {
    return db('themes').insert(theme);
}
}; 