import inquirer from 'inquirer';
import pool from './db.js';
import viewDepartments from './viewDeapartments.js';
import viewRoles from './viewRoles.js';
import viewEmployees from './viewEmployees.js';


async function mainMenu(): Promise<void> {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
      ],
    },
  ]);

  try {
    switch (action) {
      case 'View all departments':
        await viewDepartments();
        break;

      case 'View all roles':
        await viewRoles();
        break;

      case 'View all employees':
        await viewEmployees();
        break;

      case 'Add a department': {
        const { departmentName } = await inquirer.prompt([
          {
            type: 'input',
            name: 'departmentName',
            message: 'Enter the name of the department:',
          },
        ]);
        await pool.query('INSERT INTO department (name) VALUES ($1)', [departmentName]);
        console.log('Department added successfully!');
        break;
      }

      case 'Add a role': {
        const departments = await pool.query('SELECT id, name FROM department');
        const departmentChoices = departments.rows.map(({ id, name }) => ({ name: name, value: id }));

        const { title, salary, department } = await inquirer.prompt([
          { type: 'input', name: 'title', message: "Enter the role's title:" },
          { type: 'input', name: 'salary', message: "Enter the role's salary:" },
          {
            type: 'list',
            name: 'department',
            message: "Select the role's department:",
            choices: departmentChoices,
          },
        ]);
        await pool.query('INSERT INTO role (title, salary, department) VALUES ($1, $2, $3)', [
          title,
          salary,
          department,
        ]);
        console.log('Role added successfully!');
        break;
      }

      case 'Add an employee': {
        const roles = await pool.query('SELECT id, title FROM role');
        const roleChoices = roles.rows.map(({ id, title }) => ({ name: title, value: id }));

        const managers = await pool.query(
          "SELECT id, first_name || ' ' || last_name AS name FROM employee"
        );
        const managerChoices = managers.rows.map(({ id, name }) => ({ name: name, value: id }));
        managerChoices.unshift({ name: 'None', value: null });

        const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
          { type: 'input', name: 'first_name', message: "Enter the employee's first name:" },
          { type: 'input', name: 'last_name', message: "Enter the employee's last name:" },
          { type: 'list', name: 'role_id', message: "Select the employee's role:", choices: roleChoices },
          { type: 'list', name: 'manager_id', message: "Select the employee's manager:", choices: managerChoices },
        ]);
        await pool.query(
          'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
          [first_name, last_name, role_id, manager_id]
        );
        console.log('Employee added successfully!');
        break;
      }

      case 'Update an employee role': {
            try {
              // Fetch employees
              const emp_update = await pool.query("SELECT id, first_name || ' ' || last_name AS name FROM employee");
              const emplist = emp_update.rows.map(({ id, name }) => ({ name: name, value: id }));
          
              // Prompt for employee selection
              const { emp_id } = await inquirer.prompt([
                { type: 'list', name: 'emp_id', message: "Select employee to update role:", choices: emplist },
              ]);
          
              // Fetch roles
              const roles = await pool.query('SELECT id, title FROM role');
              const roleChoices = roles.rows.map(({ id, title }) => ({ name: title, value: id }));
          

              const { role_id } = await inquirer.prompt([
                { type: 'list', name: 'role_id', message: "Select the employee's new role:", choices: roleChoices },
              ]);
          
              await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, emp_id]);
              console.log('Employee role updated successfully!');
            } catch (err) {
              console.error('Error updating employee role:', err);
            }
            break;
        }

      case 'Exit':
        console.log('Goodbye!');
        pool.end();
        process.exit();
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mainMenu(); // Return to main menu after each action
  }
}

// Initial invocation of the main menu
export default mainMenu;





