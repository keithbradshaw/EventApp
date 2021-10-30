const logger = require('../config.js');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    const authHeader = req.get('Authorization');


    //Check for auth header
    if (!authHeader) {
        req.isAuth = false;
        logger.log('warn', 'No authorization header')
        return next();
    }
    const token = authHeader.split(' ')[1];

    if (!token || token === '') {
        req.isAuth = false;
        logger.log('warn', 'No token')

        return next()
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'mysupersecrethashingkey')
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    if (!decodedToken) {
        req.isAuth = false;
        return next()
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;

    return next();
}