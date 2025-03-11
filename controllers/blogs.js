const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user')
    res.status(200).json(blogs)
})

blogsRouter.get('/:id', async (req, res) => {
    const singleBlog = await Blog.findById(req.params.id)
    res.status(200).json(singleBlog)
})

blogsRouter.post('/', middleware.tokenExtractor, middleware.userExtractor, async (req, res) => {
    const body = req.body
    if (!body.title || !body.url) {
        return res.status(400).json({ mssg: "Missing required title or url field" })
    }
    const user = req.user
    if (!user) {
        return res.json(401).json({ mssg: "User not found" })
    }
    const blog = new Blog({
        ...body, user: user._id
    })
    console.log(blog)
    const returnBlog = await blog.save()
    if (returnBlog) {
        user.blogs = user.blogs.concat(returnBlog._id)
        await user.save()
        res.status(201).json(returnBlog)
    } else {
        res.status(404).end()
    }
})

blogsRouter.delete('/:id', middleware.tokenExtractor, middleware.userExtractor, async (req, res) => {
    const user = request.user
    const blog = await Blog.findById(req.params.id)
    console.log(blog.user, "and", user._id)
    if (blog.user == user._id) {
        await Blog.findByIdAndDelete(req.params.id)
    }
    res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
    const body = req.body
    const response = await Blog.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true })
    if (response) {
        res.status(200).json(response)
    } else {
        res.status(404).json({ mssg: "not found" })
    }
})

module.exports = blogsRouter