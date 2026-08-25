/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('training').del()
  await knex('training').insert([
    {user_id: 2, course_name: 'brc', completion_date: '2026-08-25', due_date: '2029-08-30'},
    {user_id: 2, course_name: 'brc2', completion_date: '2026-08-25', due_date: '2029-08-30'},
    {user_id: 2, course_name: 'arc', completion_date: '2026-08-25', due_date: '2031-08-30'}
  ]);
};
