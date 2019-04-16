const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Used to check if the request has a token.
 * If it does then it verifies the token and
 * adds the userId from the token to the request.
 */
const verifyToken = (req, res, next) => {
    var token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).json({
            auth: false,
            message: 'No token provided'
        })
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(500).json({
                auth: false,
                message: 'Failed to authenticate token'
            })
        }
        req.userId = decoded.id
        next();
    })
}

module.exports = verifyToken;