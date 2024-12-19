const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json()); 

const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root',      
    password: '',      
    database: 'employee_details', 
});
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    } else {
        console.log('Connected to the database');
    }
});
app.post('/employee', (req, res) => {
    const { employeeId, name, email, phone, department, dateOfJoining, role } = req.body;
    const checkQuery = 'SELECT * FROM employees WHERE employee_id = ? OR email = ?';
    db.query(checkQuery, [employeeId, email], (err, results) => {
        if (err) return res.status(500).send({ message: 'Database error' });
        if (results.length > 0) {
            return res.status(400).send({ message: 'Employee ID or Email already exists' });
        }

        const insertQuery = `INSERT INTO employees (employee_id, name, email, phone, department, date_of_joining, role) 
                             VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.query(insertQuery, [employeeId, name, email, phone, department, dateOfJoining, role], (err) => {
            if (err) return res.status(500).send({ message: 'Failed to add employee' });
            res.send({ message: 'Employee added successfully!' });
        });
    });
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
