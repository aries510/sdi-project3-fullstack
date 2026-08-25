/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('training', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('id').inTable('users');
    table.string('course_name').notNullable();
    table.date('completion_date').notNullable();
    table.date('due_date')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  knex.schema.alterTable('training', function(table){
    table.dropForeign('user_id')
  });
  return knex.schema.dropTableIfExists('training')
};
