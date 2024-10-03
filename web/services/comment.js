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

export async function createComment(commentData) {
  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId'); 

  if (!token || !userId) {
    throw new Error("User is not authenticated");
  }

  const payload = { ...commentData, userId };

  const response = await fetch("http://localhost:8080/api/comment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create comment");
  }

  return await response.json();
}

export async function handleNewCommentSubmit(event, postId) {
  event.preventDefault();

  const form = event.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const content = form.content.value;

  if (!content.trim()) {
    document.getElementById('form-error').innerText = "Comment cannot be empty";
    document.getElementById('form-error').style.display = 'block';
    return;
  }

  submitButton.disabled = true;

  try {
    const response = await createComment({ content, postId });

    if (response.code === 200) {
      document.getElementById('form-success').style.display = 'block';
      document.getElementById('form-error').style.display = 'none';
      form.content.value = '';

      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } else {
      document.getElementById('form-error').innerText = response.message || 'Failed to create comment';
      document.getElementById('form-error').style.display = 'block';
      submitButton.disabled = false;
    }
  } catch (error) {
    document.getElementById('form-error').innerText = 'Failed to create comment. Please try again.';
    document.getElementById('form-error').style.display = 'block';
    submitButton.disabled = false;
  }
}
