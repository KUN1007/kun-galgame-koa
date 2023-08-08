import PostModel from '@/models/postModel'

class PostController {
  // Create a new post
  async createPost(ctx) {
    try {
      const { title, floor, html, text, tags, uid, category } = ctx.request.body
      const post = new PostModel({
        title,
        floor,
        html,
        text,
        tags,
        uid,
        category,
      })
      await post.save()
      ctx.body = { message: 'Post created successfully', post }
    } catch (err) {
      ctx.throw(500, 'Internal Server Error')
    }
  }

  // Get a single post by pid
  async getPost(ctx) {
    try {
      const pid = ctx.params.pid
      const post = await PostModel.findOne({ pid })
      if (!post) {
        ctx.throw(404, 'Post not found')
      }
      ctx.body = { post }
    } catch (err) {
      ctx.throw(500, 'Internal Server Error')
    }
  }

  // Update a single post by pid
  async updatePost(ctx) {
    try {
      const pid = ctx.params.pid
      const { title, floor, html, text, tags, category } = ctx.request.body
      const updatedPost = await PostModel.findOneAndUpdate(
        { pid },
        {
          title,
          floor,
          html,
          text,
          tags,
          category,
          edited: new Date(),
        },
        { new: true } // Return the updated post
      )
      if (!updatedPost) {
        ctx.throw(404, 'Post not found')
      }
      ctx.body = { message: 'Post updated successfully', post: updatedPost }
    } catch (err) {
      ctx.throw(500, 'Internal Server Error')
    }
  }

  // Delete a single post by pid
  async deletePost(ctx) {
    try {
      const pid = ctx.params.pid
      const deletedPost = await PostModel.findOneAndDelete({ pid })
      if (!deletedPost) {
        ctx.throw(404, 'Post not found')
      }
      ctx.body = { message: 'Post deleted successfully', post: deletedPost }
    } catch (err) {
      ctx.throw(500, 'IntWernal Server Error')
    }
  }
}

export default new PostController()
