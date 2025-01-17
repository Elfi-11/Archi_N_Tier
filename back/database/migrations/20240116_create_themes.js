exports.up = function(knex) {
    return knex.schema.createTable('themes', table => {
    table.increments('id');
    table.string('nom_theme').notNullable();
    table.string('description');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('themes');
}; 