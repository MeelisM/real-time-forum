import { renderLogin } from './src/auth.js';
import { renderPosts } from './src/posts.js';
import { renderChat } from './src/chat.js'

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {

        renderChat();
    } else {
        renderLogin();
    }
});
