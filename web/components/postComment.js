import {fetchComments} from '../services/comment.js';

export async function CommentComponent(postId) {
    try {
        const comments = await fetchComments(postId);

        if (!comments || !comments.length) {
            return `
        <div class="no-comments">
          <p>No comments yet.</p>
        </div>
      `;
        }

        return comments.map(comment => `
      <div class="comment">
        <p>${comment.content}</p>
        <small>Commented at: ${new Date(comment.createdAt).toLocaleString()}</small>
      </div>
    `).join('');
    } catch (error) {
        return `
      <div class="error">
        <p>Error: ${error.message}</p>
      </div>
    `;
    }
}
