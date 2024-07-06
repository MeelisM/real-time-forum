import { handleCombinedSubmit } from '../services/post.js';
import { PictureUploadComponent } from './pictureUpload.js';

export function NewPostComponent() {
  const pictureUploadContent = PictureUploadComponent('post');

  const newPostFormHTML = `
    <div class="new-post-view">
      <h2>Create a New Post</h2>
      <form id="new-post-form" enctype="multipart/form-data">
        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" id="title" name="title" required>
        </div>
        <div class="form-group">
          <label for="category">Category</label>
          <select id="category" name="category" required>
            <option value="">Select a category</option>
            <option value="Web Development">Web Development</option>
            <option value="Programming Languages">Programming Languages</option>
            <option value="Database Systems">Database Systems</option>
          </select>
        </div>
        <div class="form-group">
          <label for="content">Content</label>
          <textarea id="content" name="content" rows="5" required></textarea>
        </div>
        <div class="form-group">
          <label for="picture">Upload Post Picture (optional)</label>
          <input type="file" id="picture" name="picture" accept="image/*">
        </div>
        <button type="submit">Create Post</button>
      </form>
      <div id="form-error" class="error" style="display: none;"></div>
      <div id="form-success" class="success" style="display: none;">Posted</div>
    </div>
  `;

  setTimeout(() => {
    const newPostForm = document.getElementById('new-post-form');
    if (newPostForm) {
      newPostForm.onsubmit = handleCombinedSubmit;
    }
  }, 0);

  return newPostFormHTML;
}
