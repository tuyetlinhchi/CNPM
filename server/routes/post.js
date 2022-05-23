const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const cloudinary = require('cloudinary').v2
const Post = require('../models/Post')
var slugify = require('slugify')

cloudinary.config({
    cloud_name: `${process.env.CLOUD_NAME}`,
    api_key: `${process.env.API_KEY}`,
    api_secret: `${process.env.API_SECRET}`
});

// @route GET events/me
// @desc Get user events
// @access Private
router.get('/me', verifyToken, async (req, res) => {
	try {
		const posts = await Post.find({ user: req.userId }).populate('user', [ 'username', 'email'])
		res.json(posts ) // HAVEN'T IMAGE YET 
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route POST events/
// @desc Create event
// @access Private
router.post('/', verifyToken, async (req, res) => {
	const { name, address, date, time, description } = req.body

	// Simple validation
	if (!name)
		return res
			.status(400)
			.json({ success: false, message: 'name is required' })

	try {
		const slug = slugify(name, { lower: true })
        // const uploadResponse = await cloudinary.uploader.upload(fileImg, {upload_preset: 'dev_setups',})	
		const newPost = new Post({
			name,
			slug,
			address, 
			date,
			time,
			description,
			// fileImg,
			user: req.userId
		})

		await newPost.save()

		res.json( newPost )
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route POST api/posts
// @desc Create post
// @access Private
router.post('/upload', verifyToken, async (req, res) => {
	
	try {
		const { formData } = req.body
		
        const uploadResponse = await cloudinary.uploader.upload(formData, {upload_preset: 'dev_setups',})	
		const newPost = new Post({
			uploadResponse,
			user: req.userId
		})

		await newPost.save()

		res.json( newPost )
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route PUT api/posts
// @desc Update post
// @access Private
router.put('/:id', verifyToken, async (req, res) => {
	const { name, description, address, date, time} = req.body

	// Simple validation
	if (!name)
		return res
			.status(400)
			.json({ success: false, message: 'name is required' })

	try {
		let slug = slugify(name)
		// let uploadResponse = await cloudinary.uploader.upload(formData, {upload_preset: 'dev_setups',})
		let updatedPost = {
			name,
			slug,
			date: date || '',
			time: time || '',
			description: description || '',
			address: address || '', 
		}

		const postUpdateCondition = { _id: req.params.id, user: req.userId }

		updatedPost = await Post.findOneAndUpdate(
			postUpdateCondition,
			updatedPost,
			{ new: true }
		)

		// User not authorized to update post or post not found
		if (!updatedPost)
			return res.status(401).json({
				success: false,
				message: 'Post not found or user not authorized'
			})

		res.json({
			success: true,
			message: 'Excellent progress!',
			post: updatedPost
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route DELETE posts
// @desc Delete post
// @access Private
router.delete('/:id', verifyToken, async (req, res) => {
	try {
		const postDeleteCondition = ({ _id: req.params.id }, {users: req.body.userId })
		const deletedPost = await Post.findOneAndDelete(postDeleteCondition)

		// User not authorized or post not found
		if (!deletedPost)
			return res.status(401).json({
				message: 'Post not found or user not authorized',
				success: false
			})

		res.json( deletedPost )
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route GET events/
// @desc Get all events
// @access Public

router.get('/', async (req, res) => {
	try {
		const events = await Post.find().populate('user', [ 'username'])
		res.json(events)
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route GET events/
// @desc Get all events
// @access Public

router.get('/count', async (req, res) => {
	try {
		const events = await Post.find()
		res.json(events.length)
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route GET events/slug
// @desc Get single events
// @access Public

router.get('/:slug', async (req, res) => {
	try {
		const slug = { slug: req.params.slug}
		const posts = await Post.find( slug )
		res.json( posts )
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

module.exports = router
