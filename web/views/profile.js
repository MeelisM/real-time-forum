import { ProfileComponent } from '../components/userProfile.js';
import { PictureUploadComponent } from '../components/pictureUpload.js';
import { ChatComponent } from '../components/userChat.js';

export default async function ProfileView() {
  const profileHtml = ProfileComponent();
  const pictureUploadHtml = PictureUploadComponent('profile');

  setTimeout(() => {
    ChatComponent();
  }, 0);

  return `
    <div id="profile-view">
      ${profileHtml}
      ${pictureUploadHtml}
      <div id="chat-container" style="display: none;"></div> <!-- Chat container where the chat UI will be rendered -->
    </div>
  `;
}
