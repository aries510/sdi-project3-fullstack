/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {id: 1, username: 'adm_respiciod', password_hash: '$2b$10$9PGZ2vL8qUuixBwskfjkau8SGEOhEIhDRpIZa2NqteP87b10X4wRq', email: 'fake.email@fake.org', role: 'admin'},
    {id: 2, username: 'respiciod', password_hash: '$2b$10$5AFKXUT9sZVbR6hv92xij.ydE/K9cXLEaxMrqSGNZ9F1NsIN5vAtO', email: 'fake.email.2@fake.org'},
  ]);
};
