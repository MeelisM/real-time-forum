// src/views/forum.js

import { ForumPostComponent } from "../components/forumPost.js";
import { ChatComponent } from "../components/userChat.js";

export default async function ForumView() {
  const forumContent = await ForumPostComponent();

  setTimeout(() => {
    ChatComponent();
  }, 0);

  return `
    <div id="forum-view">
      ${forumContent}
      <div id="chat-container" style="display: none;"></div> <!-- Chat container where the chat UI will be rendered -->
    </div>
  `;
}
