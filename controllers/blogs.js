const blogsRouter = require('express').Router()
const blog = require('../models/blog')
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
        const populatedBlog = await returnBlog.populate('user')
        user.blogs = user.blogs.concat(returnBlog._id)
        await user.save()
        res.status(201).json(populatedBlog)
    } else {
        res.status(404).end()
    }
})

blogsRouter.delete('/:id', middleware.tokenExtractor, middleware.userExtractor, async (req, res) => {
    const user = req.user
    const blog = await Blog.findById(req.params.id)
    console.log(blog.user.toString(), "and", user._id.toString())
    if (blog.user.toString() === user._id.toString()) {
        await Blog.findByIdAndDelete(req.params.id)
        user.blogs = user.blogs.filter(b => b != req.params.id)
        await user.save()
    } else {
        return res.status(401).json({ error: 'You are not the one who created the blog' })
    }
    res.status(204).end()
})

blogsRouter.put('/:id', middleware.tokenExtractor, middleware.userExtractor, async (req, res) => {
    const body = req.body
    const user = req.user
    console.log(body)
    if (body.user == user._id) {
        const response = await Blog.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true }).populate('user')
        if (response) {
            console.log(response)
            res.status(200).json(response)
        } else {
            res.status(404).json({ mssg: "not found" })
        }
    }

})

blogsRouter.post('/:id/comment', async (req, res) => {
    const content = req.body
    console.log(content)
    const foundedBlog = await Blog.findById(req.params.id).populate('user')
    if (foundedBlog) {
        foundedBlog.comments = foundedBlog.comments.concat(content.comment)
        console.log(foundedBlog)
        await foundedBlog.save()
        return res.status(200).json(foundedBlog)
    } else {
        res.status(404).json({ error: "Not found" })
    }

})

module.exports = blogsRouter