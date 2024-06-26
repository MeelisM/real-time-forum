import { LoginComponent, handleLoginSubmit } from "../components/loginForm.js";

export default function LoginView() {
  return LoginComponent();
}

export function mountLogin() {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmit);
  } else {
    console.error("Login form not found");
  }
}
