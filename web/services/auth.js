export async function handleLoginSubmit(event) {
  event.preventDefault();
  const usernameOrEmail = document.getElementById("usernameOrEmail").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:8080/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username_or_email: usernameOrEmail, password }),
    });

    const data = await response.json();

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
