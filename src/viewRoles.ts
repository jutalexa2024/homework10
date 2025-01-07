import pool from './db.js';

//understand this
async function viewRoles(): Promise<void> {
    try {
      const { rows } = await pool.query('SELECT id, title, salary FROM role');
      console.table(rows);
    } catch (err) {
      console.error('Error viewing departments:', err);
    }
}

export default viewRoles;