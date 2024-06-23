import { fetchPosts } from '../services/post.js';
import { fetchComments } from '../services/comment.js';

export async function ForumPostComponent() {
  try {
    const posts = await fetchPosts();

    // Fetch comments for each post
    const postsWithComments = await Promise.all(posts.map(async (post) => {
      const comments = await fetchComments(post.id);
      const commentsHtml = comments
        .map(
          (comment) => `
          <div class="comment">
            <p>${comment.content}</p>
            <small>Commented at: ${new Date(comment.createdAt).toLocaleString()}</small>
          </div>
        `
        )
        .join('');

      return `
        <div class="post">
          <h2>${post.title}</h2>
          <p>${post.content}</p>
          <small>Posted at: ${new Date(post.createdAt).toLocaleString()}</small>
          <div class="comments">
            ${commentsHtml}
          </div>
        </div>
      `;
    }));

    return `
      <div>
        ${postsWithComments.join('')}
      </div>
    `;
  } catch (error) {
    return `
      <div>
        <p>Error: ${error.message}</p>
      </div>
    `;
  }
}
