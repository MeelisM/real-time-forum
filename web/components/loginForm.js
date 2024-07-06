// src/components/loginForm.js

export function LoginComponent() {
    const loginFormHTML = `
    <div class="center-container">
      <div class="user-container">
          <div class="logo-container">
              <img src="static/img/logo.png" alt="Logo">
          </div>
          <form class="user-form" id="loginForm">
              <div class="form-group">
                  <input type="text" id="user" name="user" placeholder="Email or Username" required>
              </div>
              <div class="form-group">
                  <input type="password" id="password" name="password" placeholder="Password" required>
              </div>
              <div class="button-container">
                  <button type="button" id="register">Register</button>   
                  <button type="submit">Login</button>  
              </div>
          </form>
      </div>
    </div>
  `;
    return loginFormHTML;
}

export async function handleLoginSubmit(event) {
    event.preventDefault();
    const usernameOrEmail = document.getElementById("user").value;
    const password = document.getElementById("password").value;

    console.log("Form submitted:", { usernameOrEmail, password }); // Debugging log

    try {
        const response = await fetch("http://localhost:8080/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ usernameOrEmail, password }),
        });

        const data = await response.json();

        console.log("Login response:", data); // Debugging log

        if (data.code === 200) {
            const userId = data.data.id;
            const username = usernameOrEmail; 
            localStorage.setItem("authToken", data.data.token);
            localStorage.setItem("userId", userId);
            localStorage.setItem("username", username); 
            
            console.log("Saved username:", localStorage.getItem("username")); // Debugging log

            window.location.hash = "#/forum";
        } else {
            alert(data.message || "Login failed");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("Login failed. Please try again.");
    }
}
