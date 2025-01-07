import pool from './db.js';

//understand this
async function viewEmployees(): Promise<void> {
    try {
      const { rows } = await pool.query("SELECT e.id AS employee_id, e.first_name, e.last_name, r.title, d.name AS department_name, r.salary, CONCAT(m.first_name, ' ' , m.last_name) AS manager_name FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON r.department = d.id LEFT JOIN employee m ON e.manager_id = m.id;");
      console.table(rows);
    } catch (err) {
      console.error('Error viewing departments:', err);
    }
}

export default viewEmployees;