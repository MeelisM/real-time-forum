import { fetchPosts } from '../services/post.js';

let allPosts = [];
let isLoading = false;
let currentPage = 1;

export async function ForumPostComponent() {
  try {
    if (allPosts.length === 0) {
      allPosts = await fetchPosts();
    }

    const postsHtml = allPosts
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

document.addEventListener('DOMContentLoaded', () => {
  const forumView = document.getElementById('forum-view');
  if (forumView) {
    forumView.addEventListener('scroll', handleScroll);
  }
});

async function handleScroll() {
  const forumView = document.getElementById('forum-view');
  if (forumView.scrollTop + forumView.clientHeight >= forumView.scrollHeight - 5 && !isLoading) {
    isLoading = true;
    currentPage++;
    await loadMorePosts();
    isLoading = false;
  }
}

async function loadMorePosts() {
  try {
    const newPosts = await fetchPosts(currentPage);
    allPosts = [...allPosts, ...newPosts];

    const postsHtml = allPosts
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

    const forumView = document.getElementById('forum-view');
    if (forumView) {
      forumView.innerHTML += postsHtml;
    }
  } catch (error) {
    console.error('Error loading more posts:', error);
  }
}
