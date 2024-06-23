export async function fetchComments(postId) {
    const token = localStorage.getItem("authToken");
  
    if (!token) {
      throw new Error("User is not authenticated");
    }
  
    const response = await fetch(`http://localhost:8080/api/comment/${postId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    const data = await response.json();
    if (data.code !== 200) {
      throw new Error(data.message || "Failed to fetch comments");
    }
  
    return data.data;
  }