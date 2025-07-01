const User = require("../models/userModel");
const md5 = require('md5');

// validate data 

const ValidateUserData = (firstname, lastname, email, contactnumber, password) => {
    const errors = [];

    if (!firstname) {
        errors.push('Name is required');
    }
    if (!lastname) {
        errors.push('Name is required');
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Email is required');
    }
    if (!contactnumber || !/^\d{10}$/.test(contactnumber)) {
        errors.push('Contact Number is required');
    }

    if (!password || !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)) {
        errors.push('Password is required');
    }

    return errors;
}

//operation from router to model
const userController = {
    getAllUsers: async (req, res) => {
        try {
            const users = await User.getAllUsers();
            res.json({
                success: true,
                data: users,
                message: "Users fetched successfully"
            })
        } catch (error) {
            console.error("Failed to fetch users", error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch users",
                error: error.message
            })
        }
    },

    getUserById: async (req, res) => {
        try {
            const { id } = req.params;

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user id"
                })
            }

            const user = await User.getUserById(id);

            //check if user is found
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                })
            }

            res.json({
                success: true,
                data: user,
                message: "User fetched successfully"
            })
        } catch (error) {
            console.error("Failed to fetch user", error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch user",
                error: error.message
            })
        }
    },

    createUser: async (req, res) => {
        try {
            const { firstname, lastname, email, contactnumber, password } = req.body;
            console.log(req.body);
            const validationErrors = ValidateUserData(firstname, lastname, email, contactnumber, password);
            if (validationErrors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user data",
                    errors: validationErrors
                })
            }

            //check if user already exist with same email
            const existingUser = await User.getUserByEmail(email);
            if (existingUser) {
                return res.status(402).json({
                    success: false,
                    message: "User already exist with same email"
                })
            }

            const hashedPassword = md5(password);
            const newUser = await User.create({ firstname, lastname, email, contactnumber, password: hashedPassword });

            res.status(201).json({
                success: true,
                data: newUser,
                message: "User created successfully"
            })
        } catch (error) {
            console.error("Failed to create user", error);
            res.status(500).json({
                success: false,
                message: "Failed to create user",
                error: error.message
            })
        }
    },

    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { firstname, lastname, email, contactnumber, password } = req.body;

            //validate id
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user id"
                })
            }

            //check if user is found
            const existingUser = await User.getUserById(id);
            if (!existingUser) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                })
            }

            //validate the updated data
            const validationErrors = ValidateUserData(firstname, lastname, email, contactnumber, password);
            if (validationErrors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user data",
                    errors: validationErrors
                })
            }

            //check if user already exist with same email
            const userWithSameEmail = await User.getUserByEmail(email);
            if (userWithSameEmail && userWithSameEmail.id !== id) {
                return res.status(402).json({
                    success: false,
                    message: "User already exist with same email"
                })
            }

            //************************************************* */
            //check if user already exist with same contactnumber
            const userWithSamecontactnumber = await User.getUserBycontactnumber(contactnumber);
            if (userWithSamecontactnumber && userWithSamecontactnumber.id !== id) {
                return res.status(402).json({
                    success: false,
                    message: "User already exist with same Contact Number"
                })
            }

            //update existing user
            const hashedPassword = md5(password);
            const updatedUser = await User.updateUser(id, { firstname, lastname, email, contactnumber, password: hashedPassword });
            if (updatedUser) {
                return res.json({
                    success: true,
                    data: updatedUser,
                    message: "User updated successfully"
                })
            }
        } catch (error) {
            console.error("Failed to update user", error);
            res.status(500).json({
                success: false,
                message: "Failed to update user",
                error: error.message
            })
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;

            //validate id
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user id"
                })
            }

            //check if user is found
            const existingUser = await User.getUserById(id);
            if (!existingUser) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                })
            }

            //delete user
            const deletedUser = await User.deleteUser(id);
            if (deletedUser) {
                return res.json({
                    success: true,
                    data: deletedUser,
                    message: "User deleted successfully"
                })
            }
        } catch (error) {
            console.error("Failed to delete user", error);
            res.status(500).json({
                success: false,
                message: "Failed to delete user",
                error: error.message
            })
        }
    },

    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ success: false, message: "Email and password are required" });
            }

            const user = await User.getUserByEmail(email);
            if (!user || user.password !== md5(password)) {
                return res.status(401).json({ success: false, message: "Invalid email or password" });
            }

            res.status(200).json({
                success: true,
                message: "Login successful",
                user,
            });
        } catch (error) {
            console.error("Login failed", error);
            res.status(500).json({
                success: false,
                message: "Login failed",
                error: error.message,
            });
        }
    }

}

module.exports = userController