const db = require('../app');

module.exports = {
  // Récupérer toutes les questions
  getAllQuestions() {
    return db('questions').select('*');
  },

  // Récupérer une question par son ID
  getQuestionById(id) {
    return db('questions').where({ id }).first();
  },

  // Ajouter une nouvelle question
  addQuestion(question) {
    return db('questions').insert(question);
  }
}; 