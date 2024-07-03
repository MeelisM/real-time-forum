import { fetchPosts } from '../services/post.js';

let allPosts = [];
let currentPage = 1;
const postsPerPage = 4;

export async function ForumPostComponent() {
  try {
    if (allPosts.length === 0) {
      allPosts = await fetchPosts();
    }

    const totalPages = Math.ceil(allPosts.length / postsPerPage);
    const paginatedPosts = allPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

    const postsHtml = paginatedPosts
      .map(
        (post) => `
          <div class="post" onclick="location.href='#/post/${post.id}'">
            <div class="post-header">
              <div class="post-category ${getCategoryClass(post.category)}">${post.category}</div>
              <h2 class="post-title">${post.title}</h2>
              <div class="post-meta">Posted at: ${new Date(post.createdAt).toLocaleString()}</div>
            </div>
            <p class="post-content">${post.content}</p>
            <small class="comment-count">Comments: ${post.commentsCount}</small>
          </div>
        `
      )
      .join('');

    return `
      <div id="forum-view">
        ${postsHtml}
        <div id="pagination-controls">
          <button id="prev-button" onclick="prevPage()" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
          <span id="page-info">Page ${currentPage} of ${totalPages}</span>
          <button id="next-button" onclick="nextPage()" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
        </div>
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

function getCategoryClass(category) {
  switch (category) {
    case 'Web Development':
      return 'web-development';
    case 'Programming Languages':
      return 'programming-languages';
    case 'Database Systems':
      return 'database-systems';
    default:
      return '';
  }
}

window.nextPage = async function() {
  currentPage++;
  document.getElementById('forum-view').innerHTML = await ForumPostComponent();
};

window.prevPage = async function() {
  currentPage--;
  document.getElementById('forum-view').innerHTML = await ForumPostComponent();
};
