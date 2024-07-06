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

    const post = data.data
    post.commentsCount = post.commentsCount || 0;

    return post;
}

export async function createPost(postData) {
    try {
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId'); 
      console.log('Request Payload:', JSON.stringify({ ...postData, userId }));
      console.log('Authorization Header:', `Bearer ${token}`);
  
      const response = await fetch("http://localhost:8080/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ...postData, userId }), 
      });
  
      return await response.json();
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }
  
  export async function handleNewPostSubmit(event) {
    event.preventDefault(); 

    const form = event.target;
    const title = form.title.value;
    const category = form.category.value;
    const content = form.content.value;
    const userId = localStorage.getItem('userId'); 
    const token = localStorage.getItem('authToken');

    try {
        const response = await createPost({ title, category, content, userId });

        if (response.code === 200) {
            document.getElementById('form-success').style.display = 'block'; 
            setTimeout(() => {
                window.location.hash = "#/forum"; 
            }, 2000);
        } else {
            document.getElementById('form-error').innerText = response.message || 'Failed to create post';
            document.getElementById('form-error').style.display = 'block';
        }
    } catch (error) {
        console.error('Error creating post:', error);
        document.getElementById('form-error').innerText = 'Failed to create post. Please try again.';
        document.getElementById('form-error').style.display = 'block';
    }
}
  