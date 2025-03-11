const { test, after, beforeEach } = require('node:test')
const assert = require('assert')
const listHelper = require('../utils/list_helper')
const mongoose = require('mongoose')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
})


test.only('Added valid user', async () => {
    const usersAtStart = await listHelper.usersInDb()
    const newUser = {
        username: 'NguyenKhangPhuc',
        name: 'Paul',
        password: '123',
    }
    await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    const userAtEnd = await listHelper.usersInDb()
    console.log(userAtEnd, 'This is user at End')
    assert.strictEqual(usersAtStart.length + 1, userAtEnd.length)
    const users = userAtEnd.map(u => u.username)
    console.log(users, 'this is users')
    assert.strictEqual(users.includes(newUser.username), true)
})

test.only('username with length < 3 cannot be added', async () => {
    const userAtStart = await listHelper.usersInDb()
    const newUser = {
        username: 'nk',
        name: 'Paul',
        password: '123',
    }
    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    const userAtEnd = await listHelper.usersInDb()
    assert.strictEqual(userAtStart.length, userAtEnd.length)
})

test.only('username not given cannot be added', async () => {
    const userAtStart = await listHelper.usersInDb()
    const newUser = {
        name: 'Paul',
        password: '123',
    }
    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    const userAtEnd = await listHelper.usersInDb()
    assert.strictEqual(userAtStart.length, userAtEnd.length)
})

test.only('User with password length < 3 cannot be added', async () => {
    const userAtStart = await listHelper.usersInDb()
    const newUser = {
        username: 'nkppp',
        name: 'Paul',
        password: '13',
    }
    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    const userAtEnd = await listHelper.usersInDb()
    assert.strictEqual(userAtStart.length, userAtEnd.length)
})

after(async () => {
    await mongoose.connection.close()
})