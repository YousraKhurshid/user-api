const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const { SignUp, Dummy, Login, allUsers, getUserbyEmail, userbyEmail, deleteUser, updateUser, getUserProfile } = require('./controller');
const verifytoken = require('./verifytoken');
const admin = require('./admin');
const User = require('./model'); // Import your User model here

router.use(bodyParser.json());

router.post('/users', Dummy);
router.post('/signup', SignUp);
router.post('/login', Login);
router.get('/getallusers', allUsers);
router.get('/userbyemail/:email', getUserbyEmail);
router.get('/getuserbyemail', userbyEmail);
router.get('/admin', verifytoken, admin);
router.delete('/deleteuser', deleteUser);
router.put('/updateuser', updateUser);
router.get('/getuserprofile', getUserProfile);

// Add a new route to assign the admin role to a user
router.put('/assignadmin/:user_Id', verifytoken, assignAdminRole);

async function assignAdminRole(req, res) {
    try {
        const userId = req.params.user_Id;
        const updatedUser = await User.findByIdAndUpdate(userId, { role: 'admin' }, { new: true });

        if (!updatedUser) {
            return res.status().json({ message: 'User not found' });
        }

        res.json({ message: 'User role updated to admin' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


module.exports = router;
