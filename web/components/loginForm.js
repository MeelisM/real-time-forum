import { handleLoginSubmit } from '../services/auth.js';

export function LoginComponent() {
  const loginFormHTML = `
    <div id="login-view">
      <form id="loginForm">
        <input type="text" id="usernameOrEmail" placeholder="Username or Email" required />
        <input type="password" id="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  `;

  setTimeout(() => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", handleLoginSubmit);
    }
  }, 0);

  return loginFormHTML;
}
