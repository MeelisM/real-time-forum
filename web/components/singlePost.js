import { fetchPostById } from '../services/post.js';
import { CommentComponent } from './postComment.js';

export async function PostComponent(postId) {
  try {
    const post = await fetchPostById(postId);
    const commentsHtml = await CommentComponent(postId);

    return `
      <div class="post-view">
        <div class="post">
          <h2>${post.title}</h2>
          <p>${post.content}</p>
          <small>Posted at: ${new Date(post.createdAt).toLocaleString()}</small>
        </div>
        <div class="comments">
          ${commentsHtml}
        </div>
      </div>
    `;
  } catch (error) {
    return `
      <div class="error">
        <p>Error: ${error.message}</p>
      </div>
    `;
  }
}
