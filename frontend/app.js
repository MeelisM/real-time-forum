import { renderLogin } from './src/auth.js';
import { renderPosts } from './src/posts.js';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        renderPosts();
    } else {
        renderLogin();
    }
});
