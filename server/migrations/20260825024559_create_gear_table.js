/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('gear', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('category').notNullable();
    table.string('brand').notNullable();
    table.date('manufactured_date');
    table.date('purchased_date').notNullable();
    table.specificType('expiration_date', "date GENERATED ALWAYS AS (purchased_date + INTERVAL '5 years') STORED");
    table.boolean('crashed').defaultTo('false').notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('id').inTable('users')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('gear')
};
