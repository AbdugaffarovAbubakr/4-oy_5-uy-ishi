const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const blogsFile = './database/blog.json';

const readBlogs = () => JSON.parse(fs.readFileSync(blogsFile));
const writeBlogs = (data) => fs.writeFileSync(blogsFile, JSON.stringify(data, null, 2));

router.post('/', (req, res) => {
    const { title, slug, content, tags } = req.body;
    const blogs = readBlogs();

    const newBlog = { id: uuidv4(), title, slug, content, tags, comments: [] };
    blogs.push(newBlog);
    writeBlogs(blogs);

    res.status(201).json(newBlog);
});

router.get('/', (req, res) => {
    const blogs = readBlogs();
    res.json(blogs);
});

router.put('/:id', (req, res) => {
    const blogs = readBlogs();
    const blogIndex = blogs.findIndex(blog => blog.id === req.params.id);

    if (blogIndex === -1) return res.status(404).json({ message: 'Blog not found' });

    blogs[blogIndex] = { ...blogs[blogIndex], ...req.body };
    writeBlogs(blogs);

    res.json(blogs[blogIndex]);
});

router.delete('/:id', (req, res) => {
    const blogs = readBlogs();
    const newBlogs = blogs.filter(blog => blog.id !== req.params.id);

    if (newBlogs.length === blogs.length)
        return res.status(404).json({ message: 'Blog not found' });

    writeBlogs(newBlogs);
    res.json({ message: 'Blog deleted successfully' });
});

module.exports = router;
