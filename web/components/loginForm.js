export function LoginComponent() {
  return `
      <div id="login-view">
          <form id="loginForm">
              <input type="text" id="username" placeholder="Username" />
              <input type="email" id="email" placeholder="Email" />
              <input type="password" id="password" placeholder="Password" />
              <button type="submit">Login</button>
          </form>
      </div>
    `;
}
