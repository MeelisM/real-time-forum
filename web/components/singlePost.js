import { fetchPostById } from '../services/post.js';
import { CommentComponent } from './postComment.js';

export async function PostComponent(postId) {
  try {
    const post = await fetchPostById(postId);
    const comments = await CommentComponent(postId);

    return `
      <div class="post-view">
        <div class="post">
          <h2 class="post-title">${post.title}</h2>
          <div class="post-meta">
            <small>Category: ${post.category}</small>
            <small>Posted at: ${new Date(post.createdAt).toLocaleString()}</small>
          </div>
          <p class="post-content">${post.content}</p>
          <small class="comment-count">Comments: ${post.commentsCount}</small>
        </div>
        ${comments}
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
