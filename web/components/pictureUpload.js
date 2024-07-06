import { handlePictureSubmit } from '../services/utils.js';

export function PictureUploadComponent(type) {
  const pictureFormHTML = `
    <div class="picture-upload">
      <form id="${type}-picture-form" enctype="multipart/form-data">
        <div class="form-group">
          <label for="${type}Picture">Upload ${type === 'profile' ? 'Profile' : 'Post'} Picture</label>
          <input type="file" id="${type}Picture" name="picture" accept="image/*" required>
        </div>
        <button type="submit">Upload</button>
      </form>
      <div id="${type}-upload-error" class="error" style="display: none;"></div>
      <div id="${type}-upload-success" class="success" style="display: none;">Picture uploaded successfully</div>
    </div>
  `;

  setTimeout(() => {
    const pictureForm = document.getElementById(`${type}-picture-form`);
    if (pictureForm) {
      pictureForm.onsubmit = (event) => handlePictureSubmit(event, type);
    }
  }, 0);

  return pictureFormHTML;
}
