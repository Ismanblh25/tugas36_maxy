const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // ganti dengan username MySQL Anda
    password: '', // ganti dengan password MySQL Anda
    database: 'automation'
});

module.exports = pool;
