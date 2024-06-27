export async function fetchPosts() {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await fetch("http://localhost:8080/api/post", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (data.code !== 200) {
    throw new Error(data.message || "Failed to fetch posts");
  }

  return data.data;
}

export async function fetchPostById(postId) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await fetch(`http://localhost:8080/api/post/${postId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (data.code !== 200) {
    throw new Error(data.message || "Failed to fetch post");
  }

  return data.data;
}
