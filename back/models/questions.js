const db = require('../app');

module.exports = {
  async getAllQuestions() {
    try {
      return await db('questions').select('*');
    } catch (error) {
      console.error('❌ Erreur BD getAllQuestions:', error);
      throw error;
    }
  },

  async getQuestionById(id) {
    try {
      return await db('questions').where({ id }).first();
    } catch (error) {
      console.error('❌ Erreur BD getQuestionById:', error);
      throw error;
    }
  },

  addQuestion(question) {
    return db('questions').insert(question);
  },

  async getQuestionsByThemeId(themeId) {
    try {
      return await db('questions')
        .select(
          'id',
          'question',
          'reponse1',
          'reponse2',
          'reponse3',
          'reponse4',
          'bonne_reponse',
          'theme_id'
        )
        .where({ theme_id: themeId });
    } catch (error) {
      console.error('❌ Erreur BD getQuestionsByThemeId:', error);
      throw error;
    }
  },

  async checkAnswer(questionId, answer) {
    try {
      const question = await db('questions')
        .select('bonne_reponse')
        .where({ id: questionId })
        .first();
      return question.bonne_reponse === answer;
    } catch (error) {
      console.error('❌ Erreur BD checkAnswer:', error);
      throw error;
    }
  }
}; 