// commentController.js
import CommentService from '@/path/to/commentService';

class CommentController {
  static async getCommentsByReplyIds(ctx) {
    try {
      const replyIds = ctx.request.body.replyIds; // 获取需要加载评论的回帖的 ID 数组
      const page = parseInt(ctx.query.page) || 1;
      const limit = parseInt(ctx.query.limit) || 5; // 每页加载的评论数量

      const comments = await CommentService.getCommentsByReplyIds(replyIds, page, limit);

      ctx.body = {
        code: 200,
        message: 'OK',
        data: comments,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to fetch comments' };
    }
  }

  // 其他评论控制逻辑...
}

export default CommentController;
