import {fetchPosts} from '../services/post.js';

export async function ForumPostComponent() {
    try {
        const posts = await fetchPosts();

        const postsHtml = posts
            .map(
                (post) => `
          <div class="post">
            <h2><a href="#/post/${post.id}">${post.title}</a></h2>
            <p>${post.content}</p>
            <small>Category: ${post.category}</small> <!-- Display category -->
            <small>Posted at: ${new Date(post.createdAt).toLocaleString()}</small>
            <small>Comments: ${post.commentsCount}</small>
          </div>
        `
            )
            .join('');

        return `
      <div>
        ${postsHtml}
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
