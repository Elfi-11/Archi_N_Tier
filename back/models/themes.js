const db = require('../app');

module.exports = {
// Récupérer toutes les themes
getAllThemes() {
    return db('themes').select('*');
},

// Récupérer une theme par son ID
getThemeById(id) {
    return db('themes').where({ id }).first();
},

// Ajouter une nouvelle theme
addTheme(theme) {
    return db('themes').insert(theme);
}
}; 