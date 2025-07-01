const { pool } = require('../database/connection');

class User {
    constructor(firstname, lastname, email, contactnumber, password) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.contactnumber = contactnumber;
        this.password = password;
    }

    //create new user
    static async create(userData) {
        const { firstname, lastname, email, contactnumber, password } = userData;
        const [result] = await pool.execute(
            'INSERT INTO users(firstname, lastname, email, contactnumber, password) VALUES(?, ?, ?, ?, ?)',
            [firstname, lastname, email, contactnumber, password]
        );
        return result;
    }

    //fetch all users
    static async getAllUsers() {
        const [result] = await pool.execute('SELECT * FROM users');
        return result;
    }

    //fetch user by id
    static async getUserById(id) {
        const [result] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
        return result[0];
    }

    //fetch user by email
    static async getUserByEmail(email) {
        const [result] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        return result[0];
    }
    //******************************************* */
    //fetch user by Contact Number
    static async getUserBycontactnumber(contactnumber) {
        const [result] = await pool.execute('SELECT * FROM users WHERE contactnumber = ?', [contactnumber]);
        return result[0];
    }

    //update user
    static async updateUser(id, userData) {
        const { firstname, lastname, email, contactnumber, password } = userData;
        const [result] = await pool.execute(
            'UPDATE users SET firstname=?, lastname=?, email=?, contactnumber=?, password=? WHERE id = ?',
            [firstname, lastname, email, contactnumber, password, id]
        );
        return result.affectedRows;
    }

    //delete user
    static async deleteUser(id) {
        const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = User;