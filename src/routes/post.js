const Router = require('koa-router')
const Post = require('../models/post')

const router = new Router()

// Create a new post
router.post('/posts', async (ctx) => {
  const postData = ctx.request.body
  try {
    const post = new Post(postData)
    await post.save()
    ctx.body = post
  } catch (err) {
    ctx.status = 400
    ctx.body = { error: err.message }
  }
})

// Get all posts
router.get('/posts', async (ctx) => {
  try {
    const posts = await Post.find()
    ctx.body = posts
  } catch (err) {
    ctx.status = 500
    ctx.body = { error: 'Internal Server Error' }
  }
})

// Get a specific post by ID
router.get('/posts/:id', async (ctx) => {
  try {
    const post = await Post.findById(ctx.params.id)
    if (post) {
      ctx.body = post
    } else {
      ctx.status = 404
      ctx.body = { error: 'Post not found' }
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = { error: 'Internal Server Error' }
  }
})

// Update a post by ID
router.put('/posts/:id', async (ctx) => {
  try {
    const post = await Post.findByIdAndUpdate(ctx.params.id, ctx.request.body, {
      new: true,
    })
    if (post) {
      ctx.body = post
    } else {
      ctx.status = 404
      ctx.body = { error: 'Post not found' }
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = { error: 'Internal Server Error' }
  }
})

// Delete a post by ID
router.delete('/posts/:id', async (ctx) => {
  try {
    const post = await Post.findByIdAndRemove(ctx.params.id)
    if (post) {
      ctx.body = { message: 'Post deleted successfully' }
    } else {
      ctx.status = 404
      ctx.body = { error: 'Post not found' }
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = { error: 'Internal Server Error' }
  }
})

module.exports = router
