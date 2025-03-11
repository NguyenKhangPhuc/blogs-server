const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (req, res) => {
    const { username, name, password } = req.body
    if (!password || password.length < 3) {
        return res.status(400).json({ error: "Password length must be >= 3" })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
        username,
        name,
        passwordHash,
    })

    const response = await user.save()
    if (response) {
        res.status(201).json(response)
    }
})

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs')
    res.status(200).json(users)
})

module.exports = usersRouter