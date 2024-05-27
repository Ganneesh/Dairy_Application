const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const session = require('express-session');
app.use(express.json());
let id1

// Define the correct path to the SQLite database
const dbPath = path.join('E:', 'new_dairy_database', 'my_dairy_database.db');  // Using path.join for correct path handling
console.log(`Database path: ${dbPath}`);

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

//Show all data from Doctor_Registration table
app.post("/login", (req, res) => {
    const {username,password} = req.body;
    console.log(username+" "+password)
    if (!username || !password ) {
        return res.status(400).send("Missing required fields.");
    }


    db.all("SELECT * FROM login_details WHERE username = ? AND password = ?", [username, password], (err, rows) => {
        
        if (err) {
            console.error(err.message);
            res.status(500).send("Error in fetching records");
          } else {
            if (rows.length > 0) {
              const session_id = rows[0].id;
              console.log(session_id)
              session.login_id = session_id; // Set session data correctly
              res.send(rows);
            } else {
              res.status(401).send("Invalid credentials");
            }
          }
    });
});

app.get("/show", (req, res) => {
    db.all("SELECT * FROM Doctor_Registration", [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Error in fetching records");
        } else {
            res.send(rows);
        }
    });
});


app.post("/register", (req, res) => {
    const { first_name, middle_name, last_name, mobile_no, email, address_1, address_2, degree, aadhar_num,created_by} = req.body;
    if (!first_name || !middle_name || !last_name || !mobile_no || !address_1 || !aadhar_num) {
        return res.status(400).send("Missing required fields.");
    }

    
   id1=session["login_id"]
   console.log("id1:- "+id1)
    const sql = `INSERT INTO Doctor_Registration 
                (First_Name, Middle_Name, Last_Name, Mobile_no, Email, Address_1, Address_2, Degree, Aadhar_Num,created_by) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
    const params = [first_name, middle_name, last_name, mobile_no, email, address_1, address_2, degree, aadhar_num,id1];

    db.run(sql, params, function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Failed to create new record: " + err.message);
        } else {
            res.status(201).send({ id: this.lastID, message: "Doctor registered successfully." });
        }
    });
});

// app.post("/register", (req, res) => {
//     // Hard-coded values
//     const first_name = "John";
//     const middle_name = "Q.";
//     const last_name = "Doe";
//     const mobile_no = "1234567890";
//     const email = "johndoe@example.com";
//     const address_1 = "123 Main St";
//     const address_2 = "Apt 4";
//     const degree = "MD";
//     const aadhar_num = 12345678;  // Ensure this is unique each time to avoid conflict due to the UNIQUE constraint

//     const sql = `INSERT INTO Doctor_Registration 
//                 (First_Name, Middle_Name, Last_Name, Mobile_no, Email, Address_1, Address_2, Degree, Aadhar_Num) 
//                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//     const params = [first_name, middle_name, last_name, mobile_no, email, address_1, address_2, degree, aadhar_num];

//     db.run(sql, params, function(err) {
//         if (err) {
//             console.error(err.message);
//             res.status(500).send("Failed to create new record: " + err.message);
//         } else {
//             res.status(201).send({ id: this.lastID, message: "Doctor registered successfully." });
//         }
//     });
// });


// Start server
app.listen(8081, () => {
    console.log('Server is running on port 8081');
});
