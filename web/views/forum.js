import { ForumPostComponent } from "../components/forumPost.js";
import { renderChat } from "../components/userChat.js";

export default async function ForumView() {
  const forumContent = await ForumPostComponent();

  setTimeout(() => {
    renderChat();
  }, 0);

  return `
    <div id="forum-view">
      ${forumContent}
      <div id="chat-container"></div> <!-- Chat container where the chat UI will be rendered -->
    </div>
  `;
}
