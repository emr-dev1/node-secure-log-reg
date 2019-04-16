const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

class UserController {

    /**
     * Registers a new user and if everything is okay
     * it responds with a JWT
     */
    signup(req, res) {
        console.log('the user is trying to signup');
        // Hash the password supplied by the user
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    error: err
                });
            } else {
                const user = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    username: req.body.username,
                    email: req.body.email,
                    password: hash
                });
                user.save(err => {
                    if (err) {
                        res.json({'status': 'error', 'errors': err})
                    } else {
                        // jwt.sign(payload, secretOrPrivateKey, [options, callback])
                        // Payload: new user's _id
                        // secretOrPrivateKey: the secret defined in config.js
                        // options: token will persist for 1 day
                        var token = jwt.sign({ id: user._id }, config.secret, {
                            expiresIn: 86400
                        })
                        res.json({'success': 'registration successful', 'token': token})
                    }
                })
            }
        })
    }

    /**
     * Signs a user in if the username exists
     * and the password comparison is true.
     * Upon success the a JWT is generated and passed
     * back to the user in the response
     */
    signin(req, res) {
        User.findOne({username: req.body.username})
        .exec()
        .then(user => {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    console.log('passwords do not match')
                    return res.status(401).json({
                        failed: 'Unauthorized access'
                    })
                }
                if (result) {
                    console.log('the passwords match')
                    var token = jwt.sign({ id: user._id }, config.secret, {
                        expiresIn: 86400
                    })
                    return res.status(200).json({
                        success: 'signin successful',
                        token: token
                    })
                }
                return res.status(401).json({
                    failed: 'Unauthorized access'
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
    }

    /**
     * Gets the profile information for the user
     */
    profile(req, res) {
        User.findById(req.userId, { password: 0 }, (err, user) => {
            if (err) {
                return res.status(500),json({
                    message: 'there was an issue finding the user'
                })
            }
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                })
            }
            res.status(200).json(user);
        })
    }
}

module.exports = new UserController();