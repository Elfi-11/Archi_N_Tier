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

  getQuestionsByThemeId(themeId) {
    return db('questions')
        .where('theme_id', themeId)
        .select('*');
  },

  
}; 