const { test, after, beforeEach } = require('node:test')
const assert = require('assert')
const listHelper = require('../utils/list_helper')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    // const blogObjects = listHelper.blogs.map(b => new Blog(b))
    // const promiseArray = blogObjects.map(b => b.save())
    // await Promise.all(promiseArray)
})

// test.only('blogs are returned as json', async () => {
//     await api
//         .get('/api/blogs')
//         .expect(200)
//         .expect('Content-Type', /application\/json/)
// })

// test.only('all blogs are returned', async () => {
//     const response = await api.get('/api/blogs')
//     assert.strictEqual(response.body.length, listHelper.blogs.length)
// })

// test.only('Valid blog can be added', async () => {
//     const newBlog = {
//         title: "Happy anniversary 2 months",
//         author: "Nguyen Thi Kim Ngan",
//         url: "https://localhost:3003",
//         likes: 100
//     }
//     await api
//         .post('/api/blogs')
//         .send(newBlog)
//         .expect(201)
//         .expect('Content-Type', /application\/json/)

//     const fullBlogs = await listHelper.blogsInDb()
//     assert.strictEqual(fullBlogs.length, listHelper.blogs.length + 1)
//     const authors = fullBlogs.map(b => b.author)
//     assert.strictEqual(authors.includes(newBlog.author), true)
// })

// test.only('blog post have id instead of _id', async () => {
//     const response = await listHelper.blogsInDb()
//     response.forEach(blog => {
//         assert.strictEqual(blog._id, undefined)
//         assert.strictEqual(blog.id !== undefined, true)
//     })
// })

// test.only('blog with no likes property will be default 0', async () => {
//     const newBlog = {
//         title: "Happy anniversary 2 months",
//         author: "Nguyen Thi Kim Ngan",
//         url: "https://localhost:3003",
//     }
//     const response = await api
//         .post('/api/blogs')
//         .send(newBlog)
//         .expect(201)
//         .expect('Content-Type', /application\/json/)
//     console.log(response.body)
//     assert.strictEqual(response.body.likes, 0)
// })

// test.only('Missing title properties will have status 400', async () => {
//     const newBlog = {
//         author: "Nguyen Thi Kim Ngan",
//         url: "https://localhost:3003",
//         likes: 100
//     }
//     await api
//         .post('/api/blogs')
//         .send(newBlog)
//         .expect(400)
// })

// test.only('Missing url properties will have status 400', async () => {
//     const newBlog = {
//         title: "Happy anniversary 2 months",
//         author: "Nguyen Thi Kim Ngan",
//         likes: 100
//     }
//     await api
//         .post('/api/blogs')
//         .send(newBlog)
//         .expect(400)
// })

// test.only('Delete a blog', async () => {
//     const fullBlogs = await listHelper.blogsInDb()
//     const startBlog = fullBlogs[0]
//     await api
//         .delete(`/api/blogs/${startBlog.id}`)
//         .expect(204)
//     const afterDeleteBlogs = await listHelper.blogsInDb()
//     assert.strictEqual(afterDeleteBlogs.length, fullBlogs.length - 1)
// })

// test.only('Update likes for blogs', async () => {
//     const fullBlogs = await listHelper.blogsInDb()
//     let startBlog = fullBlogs[0]
//     startBlog.likes = 100
//     const response = await api
//         .put(`/api/blogs/${startBlog.id}`)
//         .send(startBlog)
//         .expect(200)
//     console.log("This is response for put method ", response.body)
//     assert.strictEqual(startBlog.likes, response.body.likes)
// })

test.only('Adding blog without token is impossible', async () => {
    const blogsAtStart = await listHelper.blogsInDb()
    const newBlog = {
        title: "Understanding JavaScript Closures",
        author: "Jane Smith",
        url: "https://example.com/js-closures",
        likes: 85
    }
    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
    console.log(response.body.error)
    const blogsAtEnd = await listHelper.blogsInDb()
    assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
    assert.strictEqual(response.body.error, 'token missing')

})

after(async () => {
    await mongoose.connection.close()
})