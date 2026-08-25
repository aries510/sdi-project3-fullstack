/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('gear').del()
  await knex('gear').insert([
    {name: 'helmet', category: 'helmet', brand: 'hjc', manufactured_date: '2025-08-01', purchased_date: '2026-08-01'},
    {name: 'jacket', category: 'jacket', brand: 'revit', manufactured_date: '2024-08-01', purchased_date: '2026-08-01'},
    {name: 'riding boots', category: 'footwear', brand: 'alpinestars', manufactured_date: '2023-08-01', purchased_date: '2026-08-01'},
    {name: 'riding gloves', category: 'gloves', brand: 'alpinestars', manufactured_date: '2019-08-01', purchased_date: '2020-08-01'}
  ]);
};
