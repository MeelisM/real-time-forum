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

export async function ForumPostComponent() {
  try {
    const posts = await fetchPosts();
    return `
      <div>
        ${posts
          .map(
            (post) => `
          <div class="post">
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <small>Posted at: ${new Date(
              post.createdAt
            ).toLocaleString()}</small>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  } catch (error) {
    return `
      <div>
        <p>Error: ${error.message}</p>
      </div>
    `;
  }
}
