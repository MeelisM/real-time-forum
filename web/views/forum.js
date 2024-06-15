import { ForumPostComponent } from "../components/forumPost.js";

export default function ForumView() {
  return `
        <div id="forum-view">
            ${ForumPostComponent()}
        </div>
    `;
}
