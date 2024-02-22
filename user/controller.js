const mongoose = require('mongoose')
require('dotenv').config()
const User = require('./model')
const { hash, compare } = require('bcryptjs')
const { sign } = require('jsonwebtoken')


const getUserProfile = (req, res) => {
    const { username } = req.body; // Assuming username is in the request body
    res.json('Hello ' + username);
}

const assignAdminRole = async (req, res) => {
    try {
      const user = await User.findBy_Id(req.params.user_Id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.role = 'admin';
      await user.save();
      res.json({ message: 'User role updated to admin' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

const Dummy = (req, res) => {
    res.json({

        username: "" + req.body.name
    })
}

const SignUp = async (req, res) => {
    const { username, password, email } = req.body;

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected");
        const existingUser = await User.exists({ email: email });
        if (existingUser) {
            res.status(208).json({
                message: "User Already Exists"
            });
        } else {
            // Define default role (e.g., 'user')
            const defaultRole = 'user';

            // Create a new user with the default role
            await User.create({ username, email, password: await hash(password, 12), role: defaultRole });
            console.log("User Created");
            res.status(201).json({
                message: "Signup Successfully"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const Login = async (req, res) => {

    const { password, email } = req.body;
    console.log("Request Body:", req.body);


    try {
        await mongoose.connect(process.env.MONGO_URI)
        const existingUser = await User.findOne({ email: email })

        if (!existingUser) {
            res.status(404).json({
                message: "User not found"
            })
        }

        else {

            const decryptPassword = await compare(password, existingUser.password)
            if (email == existingUser.email && decryptPassword) {
                const token = sign(
                    {
                        id: existingUser._id,
                        username: existingUser.username,
                        email: existingUser.email,
                        profile : existingUser.profile,
                        role : existingUser.role
                    }
                    ,
                    process.env.JWT_SECRET
                )

                res.json({
                    message: "Successfully Loggined",
                    token: token
                })
            }

            else {
                res.json({
                    message: "invalid Credentials"
                })
            }





        }

    }
    catch (error) {
        res.json({
            message: error.message
        })

    }
}

const allUsers = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        const Users = await User.find()
        res.json(
            {
                Users: Users
            }
        )

    }

    catch (error) {
        res.json(
            {
                message: error.message
            }
        )

    }
}


const getUserbyEmail = async (req, res) => {

    const { email } = req.params


    try {
        await mongoose.connect(process.env.MONGO_URI)
        const Users = await User.findOne({ email: email })
        res.json(
            {
                Users: Users
            }
        )

    }

    catch (error) {
        res.json(
            {
                message: error.message
            }
        )

    }
}

const userbyEmail = async (req, res) => {

    const { email } = req.query


    try {
        await mongoose.connect(process.env.MONGO_URI)
        const Users = await User.findOne({ email: email })
        res.json(
            {
                Users: Users
            }
        )

    }

    catch (error) {
        res.json(
            {
                message: error.message
            }
        )

    }
}

const updateUser = async (req, res) => {
    const { email, username, profile } = req.body;

    const filter = { email };
    const update = { username, profile };

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected");

        const updatedUser = await User.findOneAndUpdate(filter, update, {
            new: true
        });

        const users = await User.find();

        res.json({
            message: "Success",
            user: updatedUser,
            users: users, 
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};


const deleteUser = async (req, res) => {
    const { email } = req.body;

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected");

        await User.deleteOne({ email });

        const users = await User.find();

        res.status(200).json({
            message: "Deleted Successfully",
            users: users,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};



module.exports = { Dummy, assignAdminRole, SignUp, Login, allUsers, getUserbyEmail, userbyEmail, updateUser, deleteUser, getUserProfile }