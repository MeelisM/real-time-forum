import { fetchAPI } from './api.js';
import { renderLogin } from './auth.js';

export async function renderPosts() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <h1>Posts</h1>
        <button id="logout-button">Logout</button>
        <div id="posts"></div>
    `;

    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.removeItem('token');
        renderLogin();
    });

    const postsDiv = document.getElementById('posts');

    try {
        const token = localStorage.getItem('token');
        const responseData = await fetchAPI('/post', 'GET', null, token);

        responseData.data.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.classList.add('post');
            postDiv.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.content}</p>
            `;
            postsDiv.appendChild(postDiv);
        });
    } catch (error) {
        alert(error.message);
    }
}
