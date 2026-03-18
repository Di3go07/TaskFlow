import mysql from 'mysql';

const user = 'di3go';
const password = 'Galo2013';

const con = mysql.createConnection({
    host: "localhost",
    user: user,
    password: password
});

const db = new Promise((resolve, reject) => {
    con.connect(function (err) {
        if (err) reject(err);
        console.log("Connected!");
    
        con.query('CREATE DATABASE IF NOT EXISTS taskflow', (err) =>{
            if (err) reject(err);
            console.log("Database created!");
        
            con.query('USE taskflow', (err) => {
                if (err) reject(err);
                console.log("Database ready to be used!")

                resolve(con)
            })
        })
    })
});

export default db;

