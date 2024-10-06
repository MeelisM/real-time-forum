import { fetchComments } from '../services/comment.js';
import { getUsernameById } from '../services/user.js';  

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

        return comments.map(comment => {
            const commentAuthor = getUsernameById(comment.userId) || 'Unknown Author';  
            return `
              <div class="comment">
                <p>${comment.content}</p>
                <small>Commented by: ${commentAuthor} at: ${new Date(comment.createdAt).toLocaleString()}</small>
              </div>
            `;
        }).join('');
    } catch (error) {
        return `
          <div class="error">
            <p>Error: ${error.message}</p>
          </div>
        `;
    }
}
