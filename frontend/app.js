document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const apiBaseUrl = 'http://localhost:8080/api'; // Change this to your backend's base URL

    function renderLogin() {
        app.innerHTML = `
            <h1>Login</h1>
            <form id="login-form">
                <input type="email" id="login-email" placeholder="Email" required>
                <input type="password" id="login-password" placeholder="Password" required>
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="#" id="show-register">Register</a></p>
        `;

        document.getElementById('show-register').addEventListener('click', renderRegister);
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const requestBody = { email, password };
                const response = await fetch(`${apiBaseUrl}/user/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                const responseText = await response.text();

                if (!response.ok) {
                    throw new Error(responseText || 'Login failed');
                }

                const responseData = JSON.parse(responseText);
                const token = responseData.data.token;
                localStorage.setItem('token', token);

                renderPosts();
            } catch (error) {
                alert(error.message);
            }
        });
    }

    function renderRegister() {
        app.innerHTML = `
            <h1>Register</h1>
            <form id="register-form">
                <input type="text" id="register-username" placeholder="Username" required>
                <input type="email" id="register-email" placeholder="Email" required>
                <input type="password" id="register-password" placeholder="Password" required>
                <input type="number" id="register-age" placeholder="Age" required>
                <select id="register-gender" required>
                    <option value="" disabled selected>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Prefer Not To Say">Prefer Not To Say</option>
                </select>
                <input type="text" id="register-firstName" placeholder="First Name" required>
                <input type="text" id="register-lastName" placeholder="Last Name" required>
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <a href="#" id="show-login">Login</a></p>
        `;

        document.getElementById('show-login').addEventListener('click', renderLogin);
        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const age = document.getElementById('register-age').value;
            const gender = document.getElementById('register-gender').value;
            const firstName = document.getElementById('register-firstName').value;
            const lastName = document.getElementById('register-lastName').value;

            const user = {
                username,
                email,
                password,
                age: parseInt(age, 10),
                gender,
                firstName,
                lastName
            };

            try {
                const response = await fetch(`${apiBaseUrl}/user`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user),
                });

                const responseText = await response.text();

                if (!response.ok) {
                    throw new Error(responseText || 'Registration failed');
                }

                renderLogin();
            } catch (error) {
                alert(error.message);
            }
        });
    }

    async function renderPosts() {
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
            const response = await fetch(`${apiBaseUrl}/post`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const responseText = await response.text();

            if (!response.ok) {
                throw new Error(responseText || 'Failed to fetch posts');
            }

            const responseData = JSON.parse(responseText);
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

    const token = localStorage.getItem('token');
    if (token) {
        renderPosts();
    } else {
        renderLogin();
    }
});
