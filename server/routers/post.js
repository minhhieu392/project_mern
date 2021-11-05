const { verify } = require('argon2');
const express = require('express');
const router = express.Router()
    //kiem tra token
const verifyToken = require('../middleware/auth')
const Post = require('../models/Post')
    //@route GET api/posts
    //@desc GET post 
    //@access Private
router.get('/', verifyToken, async(req, res) => {
    try {
        const posts = await Post.find({ user: req.userId }).populate('user', ['username'])
        res.json({ success: true, posts })
    } catch (error) {
        console.log(error)
        return res.status(403).json({ success: false, message: 'Invalid token' })
    }
})




//@route POST api/posts
//@desc Create post 
//@access Private
router.post('/', verifyToken, async(req, res) => {
        const { title, description, url, status } = req.body
            //simple validation 
        if (!title)
            return res.status(400).json({ success: false, message: 'Title is required' })
        try {
            const newPost = new Post({
                title,
                description,
                url: url.startsWith('https://') ? url : `https://${url}`,
                status: status || 'TO LEARN',
                user: req.userId
            })
            await newPost.save()
            res.json({ success: true, message: 'Happy', post: newPost })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    })
    //@route PUT api/posts
    //@desc Update post 
    //@access Private
router.put('/:id', verifyToken, async(req, res) => {
        const { title, description, url, status } = req.body
            //simple validation 
        if (!title)
            return res.status(400).json({ success: false, message: 'Title is required' })
        try {
            let updatedPost = {
                title,
                description: description || '',
                url: (url.startsWith('https://') ? url : `https://${url}`) || '',
                status: status || 'TO LEARN'

            }
            const postUpdateConditon = { _id: req.params.id, user: req.userId }
            updatedPost = await Post.findOneAndUpdate(postUpdateConditon, updatedPost, { new: true })
                //user not authorised to update posts
            if (!updatedPost)
                return res.status(401).json({ success: false, message: 'Post not found' })
            res.json({ success: true, message: 'Excellent progress!', post: updatedPost })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }

    })
    //@route DELETE api/posts
    //@desc Delete post 
    //@access Private
router.delete('/:id', verifyToken, async(req, res) => {
    try {
        const postDeleteCondition = { _id: req.params.id, user: req.userId }
        const deletedPost = await Post.findOneAndDelete(postDeleteCondition)
            //user not authorised or post not found
        if (!deletedPost)
            return res.status(401).json({ success: false, message: 'Post not found or user not authorised' })
        res.json({ success: true, post: deletedPost })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})
module.exports = router