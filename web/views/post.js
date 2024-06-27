import { PostComponent } from '../components/singlePost.js';
import { ChatComponent } from '../components/userChat.js';

export default async function PostView(params) {
  const { id } = params;

  try {
    const postHtml = await PostComponent(id);

    setTimeout(() => {
      ChatComponent();
    }, 0);

    return `
      <div>
        ${postHtml}
        <div id="chat-container" style="display: none;"></div> <!-- Chat container where the chat UI will be rendered -->
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
