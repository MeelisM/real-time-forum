import { fetchPosts } from '../services/post.js';
import { fetchAllUsers, getUsernameById } from '../services/user.js';  // Assume fetchAllUsers loads all user data

let allPosts = [];
let isLoading = false;
let currentPage = 1;

export async function ForumPostComponent() {
  try {
    // Fetch users before rendering posts
    await fetchAllUsers(); // Ensure all user data is loaded
    
    if (allPosts.length === 0) {
      allPosts = await fetchPosts();
    }

    const postsHtml = allPosts
      .map((post) => {
        const username = getUsernameById(post.userId) || 'Unknown Author';  
        return `
          <div class="post" onclick="location.href='#/post/${post.id}'">
            <div class="post-header">
              <div class="post-category ${getCategoryClass(post.category)}">${post.category}</div>
              <h2 class="post-title">${post.title}</h2>
              <div class="post-meta">
                <span>Posted by: ${username}</span>  <!-- Show the username here -->
                <span>Posted at: ${new Date(post.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <p class="post-content">${post.content}</p>
            <small class="comment-count">Comments: ${post.commentsCount}</small>
          </div>
        `;
      })
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

    // Ensure that users are loaded before loading more posts
    await fetchAllUsers(); 

    allPosts = [...allPosts, ...newPosts];

    const postsHtml = allPosts
      .map((post) => {
        const username = getUsernameById(post.userId) || 'Unknown Author';
        return `
          <div class="post" onclick="location.href='#/post/${post.id}'">
            <div class="post-header">
              <div class="post-category ${getCategoryClass(post.category)}">${post.category}</div>
              <h2 class="post-title">${post.title}</h2>
              <div class="post-meta">
                <span>Posted by: ${username}</span> 
                <span>Posted at: ${new Date(post.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <p class="post-content">${post.content}</p>
            <small class="comment-count">Comments: ${post.commentsCount}</small>
          </div>
        `;
      })
      .join('');

    const forumView = document.getElementById('forum-view');
    if (forumView) {
      forumView.innerHTML += postsHtml;
    }
  } catch (error) {
    console.error('Error loading more posts:', error);
  }
}
