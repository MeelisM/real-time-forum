import { fetchPostById } from '../services/post.js';
import { CommentComponent } from './postComment.js';
import { handleNewCommentSubmit } from '../services/comment.js'; 

export async function PostComponent(postId) {
  try {
    const post = await fetchPostById(postId);  
    const comments = await CommentComponent(postId);  

    const postHtml = `
      <div class="post-view">
        <!-- Post content -->
        <div class="post">
          <h2 class="post-title">${post.title}</h2>
          <div class="post-meta">
            <small>Category: ${post.category}</small>
            <small>Posted at: ${new Date(post.createdAt).toLocaleString()}</small>
          </div>
          <p class="post-content">${post.content}</p>
          <small class="comment-count">Comments: ${post.commentsCount}</small>
        </div>

        <!-- Comment submission form -->
        <div class="new-comment-view">
          <h3>Leave a Comment</h3>
          <form id="new-comment-form">
            <div class="form-group">
              <textarea id="content" name="content" placeholder="Write your comment..." required></textarea>
            </div>
            <button type="submit">Submit Comment</button>
          </form>
          <div id="form-error" class="error" style="display: none;"></div>
          <div id="form-success" class="success" style="display: none;">Comment posted</div>
        </div>

        <!-- Existing comments section -->
        <div id="comments-section">
          ${comments}
        </div>
      </div>
    `;

    document.getElementById('app').innerHTML = postHtml;

setTimeout(() => {
  const newCommentForm = document.getElementById('new-comment-form');
  if (newCommentForm) {
    newCommentForm.addEventListener('submit', (event) => handleNewCommentSubmit(event, postId));
  } else {
    console.error("Form not found");
  }
}, 0);


    return postHtml;  

  } catch (error) {
    return `
      <div class="error">
        <p>Error: ${error.message}</p>
      </div>
    `;
  }
}
