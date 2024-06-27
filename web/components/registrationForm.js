import {handleUserCreationSubmit} from '../services/createUser.js';

export function RegistrationComponent() {
    const userCreationFormHTML = `
    <div class="center-container">
    <div class="user-container">
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
