import { LoginComponent } from "../components/loginForm.js";

export default function LoginView() {
  return `
        <div id="login-view">
            ${LoginComponent()}
        </div>
    `;
}
