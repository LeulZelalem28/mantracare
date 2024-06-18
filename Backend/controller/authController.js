const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
    constructor (db) {
        this.db = db;
    }

    handleLogin = async (req, res) => {
        try {
            const loginData = req.body;
            const loginMode = req.body.loginMode
            let foundUser

            // Validate login mode
            if (loginMode !== 'email' && loginMode !== 'username') {
                return res.status(400).json({ 'message': 'Invalid login mode' });
            }

            //check if all fields are sent 
            if(loginMode === 'username' && !loginData.username) {
                return res.status(400).json({ 'message': 'Username  is required for login'});
            }

            if (loginMode === 'email' && !loginData.email) {
                return res.status(400).json({ 'message': 'Email is required for login' });
            }

            if (!loginData.password) {
                return res.status(400).json({ 'message': 'Password is required for login' });
            }
            
    
            // Define the user collections
            const patientCollection = this.db.getDB().collection('patients');
            const therapistCollection = this.db.getDB().collection('therapists');
            const customerAndCrisisSupportCollection = this.db.getDB().collection('customerandcrisissupports');
            const administratorCollection = this.db.getDB().collection('administrators');


            //login by email
            if (loginMode === 'email') {
                foundUser = await patientCollection.findOne({ _email: loginData.email });
                if (!foundUser) {
                    foundUser = await therapistCollection.findOne({ _email: loginData.email });
                    if(foundUser){
                        if(foundUser._approved == false) return res.status(401).json({ message: 'U have not been authorized'})
                    }     
                }
                if (!foundUser) {
                    foundUser = await administratorCollection.findOne({ _email: loginData.email });
                }
                if (!foundUser) {
                    foundUser = await customerAndCrisisSupportCollection.findOne({ _email: loginData.email });
                }
            } else { // loginMode === 'username', login by username
                foundUser = await patientCollection.findOne({ _username: loginData.username });
                if (!foundUser) {
                    foundUser = await therapistCollection.findOne({ _username: loginData.username });
                }
                if (!foundUser) {
                    foundUser = await administratorCollection.findOne({ _username: loginData.username });
                }
                if (!foundUser) {
                    foundUser = await customerAndCrisisSupportCollection.findOne({ _username: loginData.username });
                }
            }
    
            // User not found
            if (!foundUser) { 
                return res.status(401).json({message: 'user not found'});
            }
    
            // Check the password and if valid create token
            const match = await bcrypt.compare(loginData.password, foundUser._password);
            if (match) {
                const role = foundUser._role;
                // Create jwt
                const accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            "userId": foundUser._userId,
                            "role": role
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '1d'}
                );
                res.json({ accessToken: accessToken, role: role, username: foundUser._username, userId: foundUser._userId });
            } else {
                return res.status(401).json({ message: 'incorrect password'});
            }
        } catch (error) {
            console.error('Error in handleLogin:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    handleLogout = async (req, res) => {
        try {
            // Respond with success message
            res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            console.error('Error in handleLogout:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
        
}


module.exports = AuthController;
