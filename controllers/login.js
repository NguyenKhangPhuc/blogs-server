
const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { SECRET_KEY } = require('../utils/config')

loginRouter.post('/', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username: username })
    if (!user) {
        return res.status(401).json({
            error: 'invalid username'
        })
    }
    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
    if (!passwordCorrect) {
        return res.status(401).json({
            error: 'invalid password'
        })
    }
    console.log(user)
    const userForToken = {
        username: user.username,
        id: user._id
    }
    console.log(userForToken)
    const token = jwt.sign(userForToken, SECRET_KEY, { expiresIn: 60 * 60 })
    console.log(user.name, user.username, "sadasdasd")
    res.status(200).send({ token, user: user.username, name: user.name })
})

module.exports = loginRouter