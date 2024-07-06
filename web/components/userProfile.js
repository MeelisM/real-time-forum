export function ProfileComponent() {
    const username = localStorage.getItem('username');
  
    return `
      <div class="profile-view">
        <div class="profile-info">
          <h2>Hello, ${username}!</h2>
        </div>
      </div>
    `;
  }
  