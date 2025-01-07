CREATE TABLE department (
    id SERIAL PRIMARY KEY,         
    name VARCHAR(30) NOT NULL      
);


CREATE TABLE role (
    id SERIAL PRIMARY KEY,        
    title VARCHAR(30) NOT NULL,    
    salary DECIMAL NOT NULL,       
    department INTEGER NOT NULL,   
    CONSTRAINT fk_department FOREIGN KEY (department) REFERENCES department (id) ON DELETE SET NULL
);


CREATE TABLE employee (
    id SERIAL PRIMARY KEY,         
    first_name VARCHAR(30) NOT NULL,  
    last_name VARCHAR(30) NOT NULL,   
    role_id INTEGER NOT NULL,        
    manager_id INTEGER,            
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role (id),
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee (id) ON DELETE SET NULL
);


\i C:\Users\justi\Homework10\seed.sql
