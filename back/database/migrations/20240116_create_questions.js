exports.up = function(knex) {
  return knex.schema.createTable('questions', table => {
    table.increments('id');
    table.string('question').notNullable();
    table.string('reponse1').notNullable();
    table.string('reponse2').notNullable();
    table.string('reponse3').notNullable();
    table.string('reponse4').notNullable();
    table.integer('bonne_reponse').notNullable();
    table.integer('theme_id')
      .unsigned()
      .references('id')
      .inTable('themes')
      .onDelete('SET NULL');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('questions');
}; 