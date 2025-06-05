const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/user');
dotenv.config()

module.exports.isLogged = async (req, res, next) => {
    const token = req.cookies.jwt;
    try {

        if (token) {
            const decoded = await jwt.verify(token, process.env.SECRET_KEY);
            if (decoded.userID) {
                const userID = decoded.userID;
                req.userID = userID;
                return next();
            } else {
                return res.redirect('/login');
            }
        } else {
            return res.redirect('/login');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports.isNotLogged = async (req, res, next) => {
    const token = req.cookies.jwt;

    try {

        if (!token) {
            return next();
        } else {
            return res.redirect('/');
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports.isAdmin = async (req, res, next) => {
    const token = req.cookies.jwt
    try {
        if (token) {
            const decoded = await jwt.verify(token, process.env.SECRET_KEY)
            if (decoded) {
                const userID = decoded.userID
                if (userID) {
                    const user = await User.findOne({ _id: userID })
                    if (user) {
                        if (user.role === 'admin') {
                            req.userID = user._id;
                            return next();
                        }
                    }
                }
            }
        }
        return res.redirect('/');
    } catch (err) {
        res.status(400).json({ erro: err.message })
    }
}
