import { NewPostComponent } from "../components/newPost.js";
import { ChatComponent } from "../components/userChat.js";

export default function NewPostView() {
  const newPostContent = NewPostComponent();

  setTimeout(() => {
    ChatComponent();
  }, 0);

  return `
    <div id="new-post-view">
      ${newPostContent}
      <div id="chat-container" style="display: none;"></div> <!-- Chat container where the chat UI will be rendered -->
    </div>
  `;
}
