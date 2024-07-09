import { handleUserCreationSubmit } from '../services/createUser.js';
import { fetchProfilePictures } from '../services/utils.js';

export async function RegistrationComponent() {
  const profilePictures = await fetchProfilePictures();
  const pictureOptions = profilePictures.map(
    (pic, index) => `<label class="profile-pic-option">
                       <input type="radio" name="profilePicture" value="${pic}" ${index === 0 ? 'checked' : ''}>
                       <img src="${pic}" alt="Profile Picture ${index + 1}">
                     </label>`
  ).join('');

  const userCreationFormHTML = `
    <div class="center-container">
      <div class="user-container">
          <div class="logo-container">
              <img src="static/img/logo.png" alt="Logo">
          </div>
          <form class="user-form" id="registrationForm">
              <div class="form-group">
                  <input type="text" id="username" placeholder="Username" required />
              </div>
              <div class="form-group">
                  <input type="email" id="email" placeholder="Email" required />
              </div>
              <div class="form-group">
                  <input type="password" id="password" placeholder="Password" required />
              </div>
              <div class="form-group">
                  <input type="number" id="age" placeholder="Age" required />
              </div>
              <div class="form-group">
                  <select id="gender" required>
                      <option value="">Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Prefer Not To Say">Prefer Not To Say</option>
                  </select>
              </div>
              <div class="form-group">
                  <input type="text" id="firstName" placeholder="First Name" required />
              </div>
              <div class="form-group">
                  <input type="text" id="lastName" placeholder="Last Name" required />
              </div>
              <div class="form-group">
                  <p>Select Profile Picture:</p>
                  <div class="profile-pic-options">
                    ${pictureOptions}
                  </div>
              </div>
              <div class="button-container">
                  <button type="submit">Register</button>
              </div>
          </form>
      </div>
    </div>
  `;

  setTimeout(() => {
    const userCreationForm = document.getElementById("registrationForm");
    if (userCreationForm) {
      userCreationForm.onsubmit = handleUserCreationSubmit;
    }
  }, 0);

  return userCreationFormHTML;
}
