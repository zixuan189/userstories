const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const {
    User
} = require('../models')

module.exports = {
    generateAccessToken: (payload) => jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '30m'
    }),

    refreshAccessToken: (payload) => jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET),

    verifyToken: (req, res, next) => {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (!token) return res.status(401).json({
            message: 'A token is required for authentication'
        })

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
            if (error) return res.status(403).json({
                message: error.message
            })
            req.userId = decoded.id
            next()
        })
    },

    checkIsUserExist: async (req, res, next) => {
        let {
            email
        } = req.body

        let row = await User.findAll({
            where: {
                email: email
            }
        })

        if (row.length == 0)
            return res.status(404).json({
                message: `User does not exist`
            })

        req.userId = row[0].id
        req.password = row[0].password
        next()
    },

    checkIsEmailValid: async (req, res, next) => {
        let {
            email
        } = req.body

        let row = await User.findAll({
            where: {
                email: email
            }
        })

        if (row.length > 0)
            return res.status(400).json({
                message: `User already exists`
            })

        next()
    },

    isAdmin: (req, res, next) => {
        User.findByPk(req.userId).then(row => {
            if (row.role == 0) {
                next()
                return row.role
            }

            return res.status(403).json({
                message: `This API is for Administator only`
            })
        })
    },

    isTeacher: (req, res, next) => {
        User.findByPk(req.userId).then(row => {
            if (row.role == 1) {
                console.log(row.role)
                next()
                console.log(row.role)
                return row.role
            }

            return res.status(403).json({
                message: `This API is for Teacher only`
            })
        })
    },

    registerUser: (req, res) => {
        let {
            email,
            name,
            password,
            role
        } = req.body

        User.create({
            email: email,
            name: name,
            password: password ? bcrypt.hashSync(password, 8) : null,
            role: role
        }).then(() => {
            res.status(201).json({
                message: `Register successfully`
            })
        }).catch(error => {
            res.status(400).json({
                message: error.errors[0].message
            })
        })
    },

    loginUser: (req, res) => {
        let {
            password
        } = req.body

        let isValidPassword = bcrypt.compareSync(password, req.password)
        if (!isValidPassword)
            return res.status(401).json({
                message: `Invalid password`
            })

        res.json({
            accessToken: module.exports.generateAccessToken({
                id: req.userId
            })
        })
    },

    registerAsStudent: (req, res) => {
        req.body.password = null
        req.body.role = 2

        module.exports.registerUser(req, res)
    },

    registerAsTeacher: (req, res) => {
        req.body.password = null
        req.body.role = 1

        module.exports.registerUser(req, res)
    }
}