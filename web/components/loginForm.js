// components/loginForm.js
export function LoginComponent() {
    const loginFormHTML = `
    <div class="center-container">
      <div class="login-container">
          <form class="login-form" id="loginForm">
              <div class="form-group">
                  <input type="text" id="user" name="user" placeholder="Email or Username" required>
              </div>
              <div class="form-group">
                  <input type="password" id="password" name="password" placeholder="Password"required>
              </div>
              <div class="button-container">
              <button type="button">Register</button>   
              <button type="submit">Login</button>  
              </div>
          </form>
      </div>
    </div>
  `;
    return loginFormHTML;
}

export async function handleLoginSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior
    const usernameOrEmail = document.getElementById("user").value;
    const password = document.getElementById("password").value;

    console.log("Form submitted:", {usernameOrEmail, password}); // Debugging log

    try {
        const response = await fetch("http://localhost:8080/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({usernameOrEmail, password}),
        });

        const data = await response.json();

        console.log("Login response:", data); // Debugging log

        if (data.code === 200) {
            localStorage.setItem("authToken", data.data.token);
            window.location.hash = "#/forum";
        } else {
            alert(data.message || "Login failed");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("Login failed. Please try again.");
    }
}
