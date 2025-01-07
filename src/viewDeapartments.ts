import pool from './db.js';

async function viewDepartments(): Promise<void> {
  try {
    const { rows } = await pool.query('SELECT id, name FROM department');
    
    console.table(rows);
  } catch (err) {
    console.error('Error viewing departments:', err.message);
  }
}

export default viewDepartments;
