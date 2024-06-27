import {LoginComponent, handleLoginSubmit} from "../components/loginForm.js";

export default function LoginView() {
    const loginHTML = LoginComponent();
    setTimeout(mountLogin, 0);
    return LoginComponent();
}

export function mountLogin() {
    const loginForm = document.getElementById("loginForm");
    const registerButton = document.getElementById("register");

    if (loginForm) {
        loginForm.addEventListener("submit", handleLoginSubmit);
    } else {
        console.error("Login form not found");
    }

    if (registerButton) {
        registerButton.addEventListener("click", () => {
            window.location.hash = "#/register";
        });
    } else {
        console.error("Register button not found");
    }
}

