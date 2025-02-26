const db = require('../app');

module.exports = {
  getAllQuestions() {
    return db('questions').select('*');
  },

  getQuestionById(id) {
    return db('questions').where({ id }).first();
  },

  addQuestion(question) {
    return db('questions').insert(question);
  },

  async getQuestionsByThemeId(themeId) {
    console.log('Recherche des questions pour le thème:', themeId);
    const query = db('questions').where('theme_id', themeId).select('*');
    console.log('Requête SQL:', query.toString()); // Log de la requête SQL
    const results = await query;
    console.log('Résultats:', results);
    return results;
  },

  
}; 