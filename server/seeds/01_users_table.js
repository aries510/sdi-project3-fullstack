/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {id: 1, username: 'adm_respiciod', email: 'fake.email@fake.org', role: 'admin'},
    {id: 2, username: 'respiciod', email: 'fake.email.2@fake.org'},
  ]);
};
